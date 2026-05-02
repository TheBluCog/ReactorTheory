# RT11 — Ethical AI Rewards Overview

## Simple explanation

RT11 is a prototype system for rewarding people who use AI ethically.

The idea is simple:

```text
If AI helps someone create trust, reduce harm, teach others, build useful tools, or improve a community, that contribution should be measurable and rewardable.
```

RT11 does not reward raw AI activity. It does not reward spam, manipulation, misinformation, or chaotic output.

Instead, it rewards:

- useful contribution
- good intent
- controlled execution
- low drift
- positive downstream impact

---

## The basic loop

```text
Use AI ethically
→ create useful contribution
→ measure alignment and impact
→ update reputation weight
→ distribute treasury rewards
```

---

## How people get paid

RT11 uses a treasury model.

When value enters the treasury, the model routes it like this:

```text
80% → UBI / public-good / contributor rewards
20% → operators / governance / infrastructure
```

The reward pool is then split into:

```text
baseline support
+
resonance-weighted bonus
```

This means people can receive a basic allocation, while higher-value ethical AI contribution can increase their payout weight.

---

## Examples

### Example 1 — Teacher

A teacher uses AI to create a clear study guide, checks it for errors, and helps students learn safely.

Result:

```text
High intent
High control
Low drift
Positive impact
```

The teacher receives stronger resonance weight.

---

### Example 2 — Mediator

A community mediator uses AI to summarize disagreements fairly and reduce conflict.

Result:

```text
Reduced entropy
Improved cooperation
Higher trust
```

The mediator receives stronger resonance weight.

---

### Example 3 — Spammer

A user uses AI to generate spam, manipulation, or misinformation.

Result:

```text
High energy
Low intent
Low control
High drift
High entropy
```

The spammer is suppressed by the scoring model.

---

## Core math

```text
UAP = (E × I × C) / D
```

Where:

```text
E = Energy / contribution intensity
I = Intent alignment
C = Control / coherence
D = Drift / misalignment
```

Expanded Resonance:

```text
R = ((E × I × C) × Impact) / (Drift × Entropy)
```

---

## Current status

RT11 currently includes:

- working UI
- simulator
- dry-run money model
- wallet scaffold
- contract scaffolds
- deployment pipeline
- validation documents

Not yet complete:

- Amoy deployment
- verified contracts
- real testnet payout
- mainnet deployment

---

## Safety rule

No real payout should happen until:

```text
1. contracts are deployed to Amoy
2. contracts are verified
3. TreasuryRouter is funded with test MATIC
4. payout dry-run matches expected allocation
5. wallet signs explicit transaction
6. tx hash is captured
```

---

## Best current claim

```text
RT11 demonstrates a working prototype for rewarding ethical AI contribution using coherence-weighted scoring and dynamic treasury allocation.
```
