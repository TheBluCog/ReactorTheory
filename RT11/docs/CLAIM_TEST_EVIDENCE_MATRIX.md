# RT11 / Resonance Engine — Claim → Test → Evidence Matrix

## Purpose

This document converts RT11 / Resonance Engine claims into a pressure-testable evidence structure.

The purpose is to separate:

```text
claims
from
mechanisms
from
tests
from
evidence
from
risks
```

This is intended for Dr. Abdelhalim Rekab’s technical review and for future patent / academic / enterprise validation work.

---

## Matrix

| # | Claim | Mechanism | Test | Current Evidence | Risk / Weakness | Validation Needed |
|---|---|---|---|---|---|---|
| 1 | RT11 does not reward raw activity alone. | UAP multiplies Energy by Intent and Control, then divides by Drift. | Compare high-energy low-coherence agent against lower-energy high-coherence agent. | NoiseNode has high Energy but receives suppressed payout due to low Intent / Control and high Drift. | Intent and Control scoring may be subjective. | Define measurable proxies for Intent and Control. |
| 2 | High-drift actors are economically penalized. | Drift is placed in denominator of UAP and Resonance equations. | Increase Drift while holding Energy constant. | Payout decreases as Drift increases. | Actors may hide or externalize drift. | Add anomaly detection, peer review, and audit trails. |
| 3 | Coherent public-good contribution earns higher allocation. | Resonance rewards Energy × Intent × Control × NetworkImpact. | Compare MediatorNode and SafetyNode against NoiseNode. | MediatorNode and SafetyNode produce higher resonance-weighted payouts. | NetworkImpact may be hard to quantify. | Create impact measurement methodology. |
| 4 | Resonance can model downstream systemic value. | NetworkImpact and Entropy extend UAP beyond isolated contribution. | Simulate same action under different network-impact assumptions. | Higher NetworkImpact increases Resonance score. | Network impact may be lagging, indirect, or ambiguous. | Define short-term and long-term impact windows. |
| 5 | Entropy reduction is economically valuable. | Entropy is a denominator in Resonance and system stability. | Lower Entropy while holding other variables constant. | Stability and Resonance increase as Entropy decreases. | Entropy can be abstract if not operationalized. | Define entropy signals: fraud, abuse, volatility, misinformation, instability. |
| 6 | Dynamic UBI can preserve a baseline while rewarding contribution. | Treasury model splits UBI pool into baseline and resonance-weighted augmentation. | Simulate all agents receiving base allocation plus weighted bonus. | All agents receive baseline; higher resonance agents receive larger augmentation. | May create inequality if bonus weighting is too aggressive. | Stress-test allocation curves and caps. |
| 7 | RT11 can suppress high-energy harmful behavior. | Low Intent and Control plus high Drift reduce usable value. | Compare NoiseNode against BuilderNode and MediatorNode. | NoiseNode does not dominate payout despite high Energy. | Bad actors may optimize for scoring metrics. | Add adversarial simulations and gaming tests. |
| 8 | Cred-NFT can act as portable contribution memory. | CredNFT stores contribution graph, resonance score, entropy index, and UBI weight. | Update state after simulated contribution events. | Contract scaffold supports these state fields. | Reputation permanence can create privacy and fairness issues. | Add privacy, appeal, and decay mechanisms. |
| 9 | Treasury routing can be made auditable. | TreasuryRouter applies fixed allocation logic and emits events. | Deploy testnet contract and inspect transactions. | Contract scaffold exists; deployment pending. | Smart contract bugs or bad recipient lists can misroute funds. | Security review, testnet deployment, and allowlist controls. |
| 10 | RT11 can operate as a governance layer before execution. | Scores determine whether value routing should proceed, pause, or require review. | Build policy thresholds for pass / audit / block / govern. | UI already expresses governance state and safety gates. | Thresholds may be arbitrary without empirical calibration. | Define threshold calibration protocol. |
| 11 | Blockchain anchoring improves auditability. | Polygon transactions and IDM records provide timestamped public references. | Link transaction hashes and provenance records in docs/UI. | Polygon anchor and IDM references exist. | On-chain anchors prove timestamp/reference, not truth of claim. | Pair anchors with signed artifacts and reproducible hashes. |
| 12 | AI systems can participate in anomaly detection and governance support. | AI can flag drift, fraud, manipulation, and instability. | Run synthetic examples through anomaly scoring. | Conceptual role documented; implementation pending. | AI bias or false positives can create unfair penalties. | Human appeal process and independent audit required. |
| 13 | RT11 can support enterprise governance use cases. | UAP/Resonance scoring can be exposed as API and dashboard. | Build SaaS API endpoints for scoring, audit, and payout preview. | SaaS architecture draft exists. | Enterprise adoption requires compliance, explainability, and integration. | Define MVP API and compliance review. |
| 14 | Testnet payout is required before production claims. | Amoy deployment validates contract interaction without real financial exposure. | Deploy CredNFT, ResonanceEngine, TreasuryRouter to Amoy. | Deployment pipeline exists; addresses pending. | Deployment may expose contract design flaws. | Complete Amoy deployment and record logs. |
| 15 | Mainnet execution must be gated by safety controls. | Multisig, allowlist, dry-run, and human approval prevent unsafe transfers. | Attempt payout only after safeguards pass. | Safety plan exists. | Human operators may bypass controls. | Enforce controls at contract and UI level. |

---

## Priority Claims for Rekab Review

The strongest review targets are:

```text
1. Drift denominator validity
2. Resonance formula usefulness
3. Objective measurement of Intent and Control
4. Gaming resistance
5. Novelty of combining alignment scoring with treasury routing
```

---

## Suggested Rekab Review Prompts

Ask Dr. Rekab:

```text
1. Which claims are mathematically defensible?
2. Which claims are too broad or underspecified?
3. Which variables require stronger definitions?
4. Which mechanisms are novel enough to protect or publish?
5. Which tests would convince a skeptical reviewer?
6. What should be removed before formal submission?
```

---

## Evidence Required Before Strong Public Claims

Before making strong claims, the following evidence should exist:

```text
- reproducible simulation output
- Amoy contract deployment addresses
- verified contracts
- dry-run payout report
- testnet payout transaction hash
- adversarial gaming tests
- independent reviewer notes
```

---

## Current Best Claim

The safest current claim is:

```text
RT11 demonstrates a working prototype for coherence-weighted contribution scoring and dynamic treasury allocation, with smart-contract scaffolding prepared for testnet validation.
```

Avoid claiming:

```text
- production readiness
- proven economic validity
- fraud-proof scoring
- real-world UBI readiness
- fully validated AI governance
```

until the relevant evidence exists.
