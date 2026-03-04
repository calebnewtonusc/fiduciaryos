"""
training/train.py — Stage 1: Supervised Fine-Tuning for FiduciaryOS.

Trains Qwen2.5-7B-Coder-Instruct on the fiduciary decision corpus using
LoRA + DeepSpeed ZeRO-3 across 10x A6000 (48GB) GPUs.

Training data format: ShareGPT conversations
  {"conversations": [{"from": "human", "value": "..."}, {"from": "gpt", "value": "..."}]}

Training data sources:
  - Portfolio analysis pairs: 87,500
  - Violation detection pairs: 105,000
  - Tax optimization pairs: 70,000
  - Rebalancing pairs: 52,500
  - Risk assessment pairs: 35,000
  Total: 350,000 pairs

Run command (10x A6000 GPUs 8–17):
    deepspeed --num_gpus=10 training/train.py \
        --data_path data/train/fiduciary_sft.jsonl \
        --output_dir checkpoints/sft \
        --model_name_or_path Qwen/Qwen2.5-7B-Coder-Instruct \
        --deepspeed training/configs/deepspeed_zero3.json

Expected runtime: ~28 hours on 10x A6000
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

import torch
from datasets import Dataset
from loguru import logger
from peft import LoraConfig, get_peft_model
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainerCallback,
    TrainingArguments,
)
from trl import SFTConfig, SFTTrainer


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

MODEL_ID = "Qwen/Qwen2.5-7B-Coder-Instruct"
LORA_RANK = 64
LORA_ALPHA = 128
LORA_DROPOUT = 0.05
TARGET_MODULES = [
    "q_proj", "k_proj", "v_proj", "o_proj",
    "gate_proj", "up_proj", "down_proj",
]
MAX_SEQ_LENGTH = 4096


# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def load_sharegpt_dataset(data_path: str, val_split: float = 0.02) -> tuple[Dataset, Dataset]:
    """
    Load ShareGPT-format JSONL and split into train/val.

    Each line must have {"conversations": [{"from": "human", "value": "..."}, {"from": "gpt", "value": "..."}]}
    """
    records = []
    path = Path(data_path)
    if path.is_dir():
        files = list(path.glob("*.jsonl"))
    else:
        files = [path]

    for file in files:
        for line in file.read_text().splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
                # Handle both ShareGPT format and direct pair format
                if "conversations" in obj:
                    records.append(obj)
                elif "prompt" in obj and "response" in obj:
                    records.append({
                        "conversations": [
                            {"from": "human", "value": obj["prompt"]},
                            {"from": "gpt", "value": obj["response"]},
                        ]
                    })
                elif "conversations" not in obj and "pairs" in obj:
                    for pair in obj["pairs"]:
                        records.append({"conversations": pair["conversations"]})
            except json.JSONDecodeError:
                continue

    logger.info(f"Loaded {len(records):,} training records from {len(files)} file(s)")

    # Shuffle and split
    import random
    random.seed(42)
    random.shuffle(records)

    split_idx = int(len(records) * (1 - val_split))
    train_records = records[:split_idx]
    val_records = records[split_idx:]

    return Dataset.from_list(train_records), Dataset.from_list(val_records)


def format_to_text(example: dict, tokenizer) -> str:
    """
    Convert ShareGPT conversation to model-native chat format.

    Uses tokenizer.apply_chat_template for Qwen2.5 chat format.
    """
    conversations = example.get("conversations", [])
    messages = []
    for turn in conversations:
        role = "user" if turn["from"] == "human" else "assistant"
        messages.append({"role": role, "content": turn["value"]})

    return tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=False,
    )


# ---------------------------------------------------------------------------
# LoRA config
# ---------------------------------------------------------------------------

def build_lora_config() -> LoraConfig:
    return LoraConfig(
        r=LORA_RANK,
        lora_alpha=LORA_ALPHA,
        lora_dropout=LORA_DROPOUT,
        target_modules=TARGET_MODULES,
        bias="none",
        task_type="CAUSAL_LM",
    )


# ---------------------------------------------------------------------------
# Callbacks
# ---------------------------------------------------------------------------

class LogMetricsCallback(TrainerCallback):
    """Log training metrics to loguru at each logging step."""

    def on_log(self, args, state, control, logs=None, **kwargs):
        if logs:
            step = state.global_step
            loss = logs.get("loss", "—")
            lr = logs.get("learning_rate", "—")
            logger.info(f"Step {step} | loss={loss} | lr={lr}")


# ---------------------------------------------------------------------------
# Main training function
# ---------------------------------------------------------------------------

def train(args: argparse.Namespace) -> None:
    logger.info(f"FiduciaryOS SFT Training | model={args.model_name_or_path}")
    logger.info(f"Data: {args.data_path} | Output: {args.output_dir}")

    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        args.model_name_or_path,
        trust_remote_code=True,
        padding_side="right",
    )
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    # Load model
    logger.info("Loading model...")
    model = AutoModelForCausalLM.from_pretrained(
        args.model_name_or_path,
        torch_dtype=torch.bfloat16,
        trust_remote_code=True,
        attn_implementation="flash_attention_2",
    )
    model.config.use_cache = False

    # Apply LoRA
    lora_config = build_lora_config()
    model = get_peft_model(model, lora_config)   # wrap first
    model.enable_input_require_grads()           # then enable on the PeftModel
    model.print_trainable_parameters()

    # Load data
    train_dataset, val_dataset = load_sharegpt_dataset(args.data_path)
    logger.info(f"Train: {len(train_dataset):,} | Val: {len(val_dataset):,}")

    # Training arguments
    sft_config = SFTConfig(
        output_dir=args.output_dir,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        per_device_eval_batch_size=args.batch_size,
        gradient_accumulation_steps=args.grad_accum,
        learning_rate=args.learning_rate,
        lr_scheduler_type="cosine",
        warmup_ratio=0.03,
        weight_decay=0.01,
        bf16=True,
        tf32=True,
        logging_steps=10,
        eval_strategy="steps",
        eval_steps=500,
        save_strategy="steps",
        save_steps=500,
        save_total_limit=3,
        load_best_model_at_end=True,
        metric_for_best_model="eval_loss",
        greater_is_better=False,
        deepspeed=args.deepspeed,
        report_to="wandb" if os.environ.get("WANDB_API_KEY") else [],
        run_name="fiduciaryos-sft-v1",
        dataloader_num_workers=4,
        remove_unused_columns=False,
        max_seq_length=args.max_seq_length,
        dataset_text_field="text",
    )

    # Format dataset
    def preprocess(example):
        return {"text": format_to_text(example, tokenizer)}

    train_dataset = train_dataset.map(preprocess, remove_columns=train_dataset.column_names)
    val_dataset = val_dataset.map(preprocess, remove_columns=val_dataset.column_names)

    # Trainer
    trainer = SFTTrainer(
        model=model,
        args=sft_config,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        callbacks=[LogMetricsCallback()],
    )

    logger.info("Starting training...")
    trainer.train()

    # Save final model (merge LoRA weights)
    logger.info("Saving model (merging LoRA)...")
    merged = model.merge_and_unload()
    merged.save_pretrained(f"{args.output_dir}/merged")
    tokenizer.save_pretrained(f"{args.output_dir}/merged")
    logger.info(f"Merged model saved to {args.output_dir}/merged")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="FiduciaryOS SFT Training")
    parser.add_argument("--model_name_or_path", type=str, default=MODEL_ID)
    parser.add_argument("--data_path", type=str, default="data/train/fiduciary_sft.jsonl")
    parser.add_argument("--output_dir", type=str, default="checkpoints/sft")
    parser.add_argument("--epochs", type=int, default=3)
    parser.add_argument("--batch_size", type=int, default=2)
    parser.add_argument("--grad_accum", type=int, default=8)
    parser.add_argument("--learning_rate", type=float, default=2e-4)
    parser.add_argument("--deepspeed", type=str, default="training/configs/deepspeed_zero3.json")
    parser.add_argument("--config", type=str, default=None, help="Path to YAML config (currently unused)")
    parser.add_argument("--max_seq_length", type=int, default=4096)
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    train(args)
