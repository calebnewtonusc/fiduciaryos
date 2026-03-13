"use client";

import { useState, useEffect, useRef } from "react";

const ACCENT = "#10B981";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealDiv({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`} style={style}>{children}</div>;
}

export default function FiduciaryOSClient() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#0a0a0a]">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <a
            href="https://specialized-model-startups.vercel.app"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Specialist AI
          </a>
          <span className="font-semibold text-sm tracking-tight">FiduciaryOS</span>
          <a
            href="https://github.com/calebnewtonusc/fiduciaryos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
          >
            GitHub
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2h7v7M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        <div className="animate-fade-up delay-0">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 border"
            style={{ borderColor: `${ACCENT}40`, color: ACCENT, backgroundColor: `${ACCENT}08` }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
            Training · ETA Q1 2027
          </div>
        </div>

        <h1
          className="serif animate-fade-up delay-1 text-5xl md:text-7xl font-light leading-[1.05] tracking-tight mb-6"
          style={{ animationDelay: "0.1s" }}
        >
          Fiduciary-grade
          <br />
          <span style={{ color: ACCENT }}>autonomous wealth</span>
          <br />
          management.
        </h1>

        <p
          className="animate-fade-up text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed mb-4"
          style={{ animationDelay: "0.2s" }}
        >
          Autonomous wealth management AI built for fiduciary compliance.
        </p>
        <p
          className="animate-fade-up text-base text-gray-400 max-w-2xl leading-relaxed mb-12"
          style={{ animationDelay: "0.25s" }}
        >
          The first wealth manager built like an aviation system — every decision is verified against a signed policy artifact, logged with a replayable audit trail, and kill-switchable in milliseconds.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="animate-fade-up flex flex-col sm:flex-row gap-3 max-w-md"
            style={{ animationDelay: "0.3s" }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-emerald-300 transition-colors bg-white"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              Join Waitlist
            </button>
          </form>
        ) : (
          <div
            className="animate-fade-up text-sm font-medium px-4 py-2.5 rounded-lg inline-block"
            style={{ color: ACCENT, backgroundColor: `${ACCENT}10`, border: `1px solid ${ACCENT}30` }}
          >
            You are on the list. We will reach out before launch.
          </div>
        )}
      </section>

      {/* The Gap */}
      <section id="gap" className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <RevealDiv className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">The Gap</p>
            <h2 className="serif text-3xl md:text-4xl font-light tracking-tight">
              What changes when a model specializes
            </h2>
          </RevealDiv>
          <div className="grid md:grid-cols-2 gap-6">
            <RevealDiv className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">General Models</p>
              <p className="text-gray-700 leading-relaxed text-sm">
                Robo-advisors automate rules. But fiduciary duty requires reasoning about the client&apos;s full situation — tax implications, household accounts, wash sale rules, risk tolerance — not a template.
              </p>
              <ul className="mt-4 space-y-2">
                {["Automate rules, not fiduciary reasoning", "Cannot model household-level after-tax optimization", "No machine-verifiable policy constraints", "Audit trails are logs, not replayable proofs"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                    <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="#E5E7EB" strokeWidth="1.5"/>
                      <path d="M4.5 7l1.5 1.5 3-3" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </RevealDiv>
            <RevealDiv className="border rounded-xl p-6" style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}04` }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>FiduciaryOS</p>
              <p className="text-gray-700 leading-relaxed text-sm">
                FiduciaryOS compiles your investment policy to a machine-checkable artifact. Every action is verified before execution and logged to an immutable audit trail.
              </p>
              <ul className="mt-4 space-y-2">
                {["Policy compiled to signed machine-checkable artifact", "Household-level after-tax optimization", "Tax-loss harvesting with wash sale safety built in", "Kill-switchable in milliseconds with full replay"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke={ACCENT} strokeWidth="1.5" fill={`${ACCENT}15`}/>
                      <path d="M4.5 7l1.5 1.5 3-3" stroke={ACCENT} strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* How It's Built */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-20">
        <RevealDiv className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">How It&apos;s Built</p>
          <h2 className="serif text-3xl md:text-4xl font-light tracking-tight">
            Three-stage training pipeline
          </h2>
        </RevealDiv>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              stage: "Stage 1",
              name: "Supervised Fine-Tuning",
              desc: "Train on robo-advisor decision logs + FINRA enforcement actions + tax optimization cases + portfolio theory corpus. Model learns what fiduciary reasoning looks like end-to-end.",
            },
            {
              stage: "Stage 2",
              name: "Reinforcement Learning",
              desc: "Reward signal: after-tax risk-adjusted return + zero fiduciary policy violations + drawdown within policy. RL teaches the model to optimize the full fiduciary objective, not just returns.",
            },
            {
              stage: "Stage 3",
              name: "Direct Preference Optimization",
              desc: "DPO on pairs of decisions — ones that respected policy constraints versus ones that violated them, even subtly. Calibrates the model to be conservative when policy is ambiguous.",
            },
          ].map((s, i) => (
            <RevealDiv key={s.stage} className="border border-gray-200 rounded-xl p-6 flex flex-col gap-3" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ color: ACCENT, backgroundColor: `${ACCENT}12` }}
                >
                  {s.stage}
                </span>
              </div>
              <p className="font-semibold text-sm">{s.name}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </RevealDiv>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <RevealDiv className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Capabilities</p>
            <h2 className="serif text-3xl md:text-4xl font-light tracking-tight">What it can do</h2>
          </RevealDiv>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 16l3-6 3 4 3-6 3 4" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="2" y="2" width="16" height="16" rx="2" stroke={ACCENT} strokeWidth="1.5"/>
                  </svg>
                ),
                title: "Tax-Loss Harvesting",
                desc: "Identifies harvesting opportunities with wash sale safety enforced at the model level — not as a post-hoc filter.",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="3" width="14" height="14" rx="2" stroke={ACCENT} strokeWidth="1.5"/>
                    <path d="M7 10l2 2 4-4" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: "Policy-Compiled Constraints",
                desc: "Your investment policy is compiled to a signed, machine-checkable artifact. Every proposed action is verified against it before execution.",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7" stroke={ACCENT} strokeWidth="1.5"/>
                    <path d="M10 6v4l3 3" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Household After-Tax Optimization",
                desc: "Optimizes across all accounts in a household — IRA, taxable, 401k — maximizing after-tax outcomes holistically.",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6 14l4-8 4 8" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.5 11h5" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Optional Alpha Sleeve",
                desc: "Sandboxed microtrading module under full fiduciary controls — isolated from core portfolio, position-capped, and auditable.",
              },
            ].map((cap) => (
              <RevealDiv key={cap.title} className="bg-white border border-gray-200 rounded-xl p-6 flex gap-4">
                <div className="shrink-0 mt-0.5">{cap.icon}</div>
                <div>
                  <p className="font-semibold text-sm mb-1.5">{cap.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{cap.desc}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Training Stats */}
      <section id="stats" className="max-w-5xl mx-auto px-6 py-20">
        <RevealDiv className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Training</p>
          <h2 className="serif text-3xl md:text-4xl font-light tracking-tight">The numbers behind the model</h2>
        </RevealDiv>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { label: "Dataset", value: "600k+", sub: "7 synthesis streams: enforcement actions, CPA tax prep, portfolio construction, Roth planning, risk assessment, and more" },
            { label: "Base Model", value: "32B", sub: "Qwen2.5-32B-Instruct with LoRA r128 — 4.5× stronger financial reasoning than the 7B baseline" },
            { label: "Reward Signal", value: "Triple", sub: "After-tax risk-adjusted return + zero policy violations + drawdown within policy" },
          ].map((stat) => (
            <RevealDiv
              key={stat.label}
              className="rounded-xl p-6 border"
              style={{ borderColor: `${ACCENT}25`, backgroundColor: `${ACCENT}05` }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
              <p className="text-2xl font-bold mb-1" style={{ color: ACCENT }}>{stat.value}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{stat.sub}</p>
            </RevealDiv>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            Part of the{" "}
            <a href="https://specialized-model-startups.vercel.app" className="underline underline-offset-2 hover:text-gray-600 transition-colors">
              Specialist AI
            </a>{" "}
            portfolio
          </p>
          <p className="text-xs text-gray-400">Caleb Newton · USC · 2026</p>
        </div>
      </footer>
    </div>
  );
}
