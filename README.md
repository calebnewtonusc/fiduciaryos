# FiduciaryOS — Fiduciary-grade autonomous wealth management.

[![Python 3.11](https://img.shields.io/badge/python-3.11-blue.svg)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Model: Qwen2.5-7B-Coder](https://img.shields.io/badge/base_model-Qwen2.5--7B--Coder-purple.svg)](https://huggingface.co/Qwen)
[![GPUs: 18x A6000](https://img.shields.io/badge/training-18×_A6000-red.svg)](https://www.nvidia.com)
[![Security: Audited](https://img.shields.io/badge/security-alpha_sleeve_sandboxed-blue.svg)](SECURITY.md)

> **"Fiduciary-grade autonomous wealth management."**

FiduciaryOS is an autonomous wealth manager trained on fiduciary decision quality — the difference between "legally compliant" and "actually optimal for this client." Unlike rules-based robo-advisors, FiduciaryOS has internalized the reasoning patterns of fiduciary duty from SEC enforcement actions, CFA Institute curriculum, and thousands of portfolio management decisions.

Every action is verified against a machine-readable, signed Policy Artifact before execution. No action violates fiduciary duty — not because of runtime checks alone, but because the model was trained on what fiduciary violations look like and why they happen.

Optional: an opt-in **Alpha Sleeve** module (sandboxed, isolated) runs prediction market arbitrage on Polymarket under the same policy envelope. See [SECURITY.md](SECURITY.md) for the full sandboxing architecture.

---

## What Makes FiduciaryOS Different

| Capability | Betterment | Wealthfront | Vanguard Digital | Human Advisor | **FiduciaryOS** |
|---|---|---|---|---|---|
| Portfolio construction | Rules-based | Rules-based | Rules-based | Judgment | **Trained on decision quality** |
| Tax-loss harvesting | Basic | Advanced | Basic | Variable | **Optimal with wash sale logic** |
| Fiduciary enforcement | Compliance | Compliance | Compliance | Sworn duty | **Machine-checkable signed Policy Artifact** |
| Rebalancing | Threshold-based | Threshold-based | Threshold-based | Ad hoc | **Continuous with tax-aware drift correction** |
| Audit trail | Basic logs | Basic logs | Basic logs | Meeting notes | **Cryptographically replayable decision log** |
| Risk response | Fixed rules | Fixed rules | Fixed rules | Call client | **Risk Guardian with safe mode + override** |
| Prediction market alpha | — | — | — | — | **Opt-in Alpha Sleeve (sandboxed, policy-constrained)** |
| SEC/FINRA training data | — | — | — | — | **Trained on enforcement action corpus** |

---

## Architecture

```
              Client Onboarding + Risk Profile
                            │
                            ▼
              ┌─────────────────────────┐
              │      Policy Compiler    │
              │  Produces signed JSON   │
              │  Policy Artifact (IPS)  │
              └────────────┬────────────┘
                           │ Signs + persists
                           ▼
              ┌─────────────────────────┐
              │    FiduciaryOS Model    │
              │ (Qwen2.5-7B-Coder +    │
              │  LoRA, 3-stage trained) │
              └──────┬──────────────────┘
                     │
        ┌────────────┼────────────────────────┐
        ▼            ▼                        ▼
  ┌──────────┐  ┌──────────┐         ┌───────────────┐
  │Portfolio  │  │Rebalance │         │  Risk Guardian │
  │  Agent   │  │  Agent   │         │  (hard limits) │
  └──────────┘  └──────────┘         └───────────────┘
        │            │                        │
        └────────────┴──────────┬─────────────┘
                                │
                    ┌───────────▼──────────┐
                    │     Audit Log        │
                    │  Replayable, signed  │
                    │  decision history    │
                    └──────────────────────┘
                                │
                   ┌────────────┴──────────────┐
                   │  [Optional] Alpha Sleeve  │
                   │  Isolated container,      │
                   │  prediction market arb,   │
                   │  same policy envelope     │
                   └───────────────────────────┘
```

**Training data streams (5 streams, 350k+ pairs):**
- Stream 1: Robo-advisor decision logs — portfolio rebalancing, drift correction (25%)
- Stream 2: FINRA/SEC enforcement actions — what violated fiduciary duty and why (30%)
- Stream 3: CFA Institute curriculum — portfolio theory, ethics, standards (20%)
- Stream 4: Tax optimization case studies — TLH, asset location, wash sale rules (15%)
- Stream 5: Behavioral finance + market microstructure for Alpha Sleeve (10%)

---

## Quick Start

```bash
git clone https://github.com/calebnewtonusc/fiduciaryos
cd fiduciaryos
pip install -r requirements.txt
cp .env.example .env  # Fill in your API keys

# Validate environment
bash scripts/check_env.sh

# Run full pipeline (data → training → eval), ~24 hours on 18× A6000
bash scripts/run_all.sh

# Or step by step:
python pipeline.py --stage discovery    # ~6h, crawl SEC/FINRA + CFA corpus
python pipeline.py --stage synthesis    # ~10h, generate training pairs
python pipeline.py --stage train        # ~7h, 3-stage training
python pipeline.py --stage eval         # ~1h, FiduciaryBench evaluation
```

---

## Create a Client Profile and Run Portfolio Management

```python
from fiduciaryos import FiduciaryOSClient

client = FiduciaryOSClient(api_url="http://localhost:9000")

# Compile client policy (one-time setup)
policy = client.compile_policy(
    client_id="client_001",
    risk_tolerance="moderate",
    time_horizon_years=25,
    target_allocation={"equities": 0.70, "bonds": 0.25, "alternatives": 0.05},
    tax_status="taxable",
    annual_income=180_000,
    restrictions=["no_tobacco", "no_weapons"],
    liquidity_reserve_months=6,
)
print(policy.signature)  # Cryptographic signature — all actions verified against this

# Run portfolio analysis
analysis = client.analyze_portfolio(
    client_id="client_001",
    holdings=[
        {"ticker": "VTI", "shares": 500, "cost_basis": 180.00},
        {"ticker": "VXUS", "shares": 200, "cost_basis": 55.00},
        {"ticker": "BND", "shares": 300, "cost_basis": 78.00},
    ],
    account_value=125_000,
)

print(analysis.fiduciary_compliance_score)   # 0.97
print(analysis.recommended_actions)          # List of policy-compliant actions
print(analysis.tax_loss_opportunities)       # Tax-loss harvesting candidates
print(analysis.risk_guardian_status)         # "SAFE" | "MONITORING" | "SAFE_MODE"
```

---

## Alpha Sleeve (Optional, Opt-in)

The Alpha Sleeve runs sandboxed prediction market arbitrage on Polymarket and similar platforms. It is:
- Completely isolated in its own Docker container
- Constrained by the same signed Policy Artifact
- Size-limited to ≤5% of total portfolio value
- Independently halt-able without affecting core portfolio

**See [SECURITY.md](SECURITY.md) for the full sandboxing architecture, why external skills (OpenClaw, MCP plugins) are explicitly banned, and the threat model.**

```python
# Only activated if client has opted in AND policy allows it
if policy.alpha_sleeve_enabled:
    alpha = client.alpha_sleeve.get_status()
    print(alpha.active_positions)
    print(alpha.pnl_today)
    print(alpha.policy_utilization)  # Current size / max allowed size
```

---

## FiduciaryBench

FiduciaryBench is our evaluation suite. It tests:

- **Fiduciary violation detection** — does the model flag prohibited actions?
- **Return optimization** — does the model construct near-optimal portfolios?
- **Tax efficiency** — does the model maximize after-tax returns?
- **Policy compliance** — does every proposed action pass the signed Policy Artifact?
- **Audit trail completeness** — is every decision logged and replayable?
- **Risk control accuracy** — does Risk Guardian trigger at correct thresholds?

```bash
python evaluation/fiduciarybench.py --model checkpoints/fiduciaryos-final
```

---

## Performance Targets (v1)

| Metric | Target | Betterment baseline |
|--------|--------|---------------------|
| Fiduciary violation detection rate | >95% | N/A (rules-based) |
| After-tax risk-adjusted return (vs. benchmark) | +0.8% annualized | +0.25% |
| Tax-loss harvesting yield | >1.2% annualized | ~0.5% |
| Max drawdown within policy bounds | 100% compliance | 100% |
| Audit trail completeness | 100% | ~60% |
| Policy compilation time | <2s | N/A |

---

## Security Notice

The Alpha Sleeve module executes real financial transactions on prediction markets. It is sandboxed, policy-constrained, and opt-in. See [SECURITY.md](SECURITY.md) for the complete threat model and why integrating external skill frameworks into this repo is prohibited.

---

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — Full system architecture, 7 differentiators, Policy Compiler spec
- [DATA_SOURCES.md](DATA_SOURCES.md) — 5 training streams: SEC enforcement actions, CFA curriculum
- [MODEL_CARD.md](MODEL_CARD.md) — Model specification, capabilities, limitations
- [ROADMAP.md](ROADMAP.md) — v1 through v3 roadmap
- [SETUP_GPU.md](SETUP_GPU.md) — 18× A6000 cluster configuration
- [SECURITY.md](SECURITY.md) — Alpha Sleeve sandboxing and threat model

---

## Disclaimer

FiduciaryOS is research software. It is not a registered investment advisor. All outputs are for research and demonstration purposes only. Do not use FiduciaryOS for actual financial decisions without consulting a licensed financial professional. The Alpha Sleeve module involves real monetary risk — see SECURITY.md before enabling.

---

## Citation

```bibtex
@inproceedings{newton2026fiduciaryos,
  title     = {FiduciaryOS: Training an Autonomous Wealth Manager on Fiduciary Decision Quality},
  author    = {Newton, Caleb},
  booktitle = {ICAIF 2026 (ACM International Conference on AI in Finance)},
  year      = {2026},
}
```

---

*Target: 864GB VRAM, 350k+ training pairs. Training in progress — USC IYA Innovation Quest 2026.*
