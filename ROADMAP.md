# FiduciaryOS Roadmap

---

## v1 — Manage (Current Build)

**Theme:** Autonomous portfolio management with machine-checkable fiduciary constraints.

**Capabilities:**
- Policy Compiler: IPS → signed Policy Artifact (RSA-4096)
- Portfolio construction: mean-variance optimization + factor exposure management
- Rebalancing: drift-triggered with tax-aware lot selection
- Tax-loss harvesting: wash sale compliant, threshold-configurable
- Risk Guardian: 4-level alert system with Safe Mode and automatic halt
- Audit Log: cryptographically signed, replayable decision history
- FiduciaryBench v1: violation detection + return optimization evaluation
- Alpha Sleeve (opt-in): Polymarket arbitrage, isolated container, policy-constrained

**Training:**
- 350k+ pairs across 5 data streams
- SFT on Qwen2.5-7B-Coder-Instruct + LoRA rank 64
- GRPO with fiduciary violation + return + audit completeness reward
- DPO on cautious vs. aggressive action preferences

**Hardware:** 18× A6000, ~7 hours total training

**Deliverable:** Deployable portfolio management API with Policy Artifact enforcement.

---

## v1.5 — Optimize (Next Release)

**Theme:** Multi-account, multi-goal tax-aware optimization.

**New Capabilities:**
- Multi-account asset location: coordinate across taxable, IRA, Roth IRA, 401k
- Roth conversion optimization: identify conversion windows based on marginal rates and RMD projections
- Social Security optimization: benefit timing given portfolio income and longevity estimates
- Required Minimum Distribution (RMD) planning for inherited accounts
- Municipal bond integration: after-tax yield calculation with state tax consideration

**New Data:**
- 30k multi-account optimization case studies
- 10k Roth conversion decision trees
- IRS publication corpus (Publication 590-A, 590-B, 946, 550)

**Target customers:** High-net-worth individuals with multi-account complexity.

---

## v2 — Plan (Q4 2026)

**Theme:** Full financial planning, not just portfolio management.

**New Capabilities:**
- Insurance optimization: term vs. whole life analysis, disability insurance, long-term care
- Estate planning integration: beneficiary designation analysis, step-up in basis optimization
- College savings optimization: 529 vs. Roth IRA vs. taxable for education funding
- Mortgage vs. invest analysis: real-time optimization given current rates and portfolio expected return
- Monte Carlo retirement projections: probability-weighted retirement income analysis

**New Model:**
- FiduciaryOS-13B or larger: full financial planning requires broader reasoning capacity
- Multi-modal inputs: accept tax returns (PDF), brokerage statements, payroll data

---

## v3 — Certify (Q2 2027)

**Theme:** Regulatory-grade fiduciary audit certificates.

**New Capabilities:**
- FiduciaryCertificate: signed, machine-readable attestation that a portfolio is being managed to fiduciary standard
- Regulatory exam readiness: automated generation of examination responses for SEC/FINRA reviews
- White-label API: investment advisers can use FiduciaryOS as their compliance infrastructure
- Multi-jurisdiction support: EU MiFID II, UK FCA, Canada OSC — jurisdiction-aware policy compilation

**Business model:** SaaS API for RIAs (Registered Investment Advisers) + enterprise licensing for compliance infrastructure.
