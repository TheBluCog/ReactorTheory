# Shauna Lee Lange — Non-Western and Digital Art Provenance Expansion

**Framework:** Shauna Lee Lange AI Art Valuation Framework  
**Parent document:** `docs/SHAUNA_LANGE_AI_ART_VALUATION_FRAMEWORK.md`  
**Focus:** Non-Western provenance, digital art provenance, AI-generated art valuation, chain-of-custody risk, and evidence-tier modeling  
**Date:** May 2026

---

## Executive Thesis

The biggest open opportunity in AI-native art valuation is not simply pricing Western paintings better. It is building the missing provenance infrastructure for categories where the public data layer is weakest:

1. **Non-Western art and cultural heritage**
2. **Digital art**
3. **AI-generated and AI-assisted art**
4. **Hybrid / phygital artworks**
5. **Colonial, post-colonial, restitution-sensitive, and cross-border chain-of-custody cases**

Traditional art market data is deepest in Western auction records, Western museum collections, European dealer archives, and canonical artist markets. That creates a structural bias. The model can become very good at scoring what the Western market already records, while remaining weak on the very categories where provenance risk, cultural value, and market opportunity may be highest.

That gap is not a weakness in the framework. It is the opportunity.

> The next generation of art valuation will be won by whoever can model the missing provenance layer.

---

## 1. Why Non-Western Provenance Is the Strategic Gap

Most existing public provenance datasets are built from Western institutions, Western market infrastructure, and Western historical archives.

They are useful, but incomplete.

Missing or underrepresented categories include:

- African cultural objects and sculpture;
- Central African colonial-era collections;
- Congolese cultural heritage;
- Benin bronzes and comparable restitution-sensitive works;
- South Asian miniatures;
- Islamic and Middle Eastern art;
- Chinese imperial, scholar, and export-market objects;
- Japanese temple, collector, and dealer lineages;
- Indigenous and First Nations material culture;
- Latin American modern and pre-Columbian works;
- Oceanic art;
- diaspora-held collections;
- oral-history-based provenance chains;
- community-held stewardship claims;
- objects where ownership, custody, possession, extraction, and cultural authority diverge.

The result is a valuation blind spot. A model trained mostly on Western auction records may overvalue formal market visibility and undervalue cultural authority, community memory, restitution risk, colonial extraction context, and non-market custodial continuity.

This matters because non-Western works often have:

- fragmented colonial records;
- missing export documentation;
- multiple competing custody narratives;
- community or state claims;
- incomplete donor records;
- missionary, military, administrative, or expeditionary intermediaries;
- unclear acquisition circumstances;
- weak public market comparables;
- strong cultural significance but limited auction liquidity;
- ethical risk that cannot be priced using ordinary market comparables.

A valuation model that cannot account for these factors is incomplete.

---

## 2. Non-Western Provenance Requires a Broader Chain-of-Custody Model

Western fine art provenance usually asks:

```text
Who owned the object, when, and through what transaction?
```

Non-Western cultural heritage often requires additional questions:

```text
Who created it?
Who held it?
Who used it?
Who had cultural authority over it?
Who removed it?
Under what power conditions?
Who sold it?
Who documented it?
Who inherited it?
Who claims it now?
Who has the right to interpret it?
```

Therefore, the chain cannot be modeled only as a clean ownership ladder.

It must separate:

1. **Creation** — maker, workshop, community, region, period.
2. **Use / ceremonial context** — cultural function and original setting.
3. **Custody** — who physically held the object.
4. **Ownership** — who claimed legal title.
5. **Removal / transfer event** — sale, gift, looting, seizure, excavation, inheritance, colonial extraction, field collection, or donation.
6. **Documentation** — who recorded the event and when.
7. **Interpretive authority** — who is qualified or entitled to contextualize meaning.
8. **Current claim environment** — restitution, repatriation, dispute, moral claim, legal claim, or unresolved status.

This creates a richer provenance graph:

```text
Object
  → Maker / Community / Region
  → Original Cultural Context
  → First Known Custodian
  → Transfer / Removal Event
  → Intermediary Agents
  → Dealer / Collector / Institution
  → Publication / Exhibition / Archive Record
  → Current Holder
  → Current Claim / Ethical Status
```

The valuation consequence:

> Legal title alone is not enough. Cultural authority and acquisition context must enter the risk model.

---

## 3. The Non-Western Evidence-Tier Overlay

Shauna Lee Lange’s Provenance Hierarchy already ranks evidence from origin documents down to weak attribution signals. For non-Western works, the hierarchy should be extended with culturally specific evidence classes.

### Non-Western Provenance Evidence Tiers

| Tier | Evidence Class | Example Evidence | Model Treatment |
|---|---|---|---|
| A | Origin / maker / community authority | maker record, workshop tradition, community recognition, indigenous authority, original commission record | strongest cultural-authority evidence |
| B | Legal export / acquisition documentation | export permits, customs records, acquisition files, field collection records, government approvals | strong legal-chain evidence |
| C | Institutional acquisition file | museum accession record, donor file, trustee minutes, archive correspondence | strong custody evidence, may need ethical review |
| D | Field / expedition / missionary / military records | expedition logs, colonial reports, missionary records, administrative records | high evidentiary value but high ethical-risk context |
| E | Dealer / collector records | invoices, gallery stock books, collector notes, sale catalogues | market-chain evidence; quality varies |
| F | Publication / exhibition record | exhibition catalogue, scholarly article, object photograph, archive image | contextual validation |
| G | Oral history / community testimony | recorded testimony, community memory, ceremonial knowledge, local provenance | may be primary cultural evidence even when not market-formal |
| H | Scientific / material analysis | material testing, dating, pigment, wood, metal, textile, residue, isotopic data | supports dating, origin, authenticity, but not title alone |
| I | Circumstantial / stylistic attribution | style, region, period, object type, comparative morphology | useful but weaker alone |
| J | Weak or unsupported claim | undocumented gallery label, vague private collection, anonymous source, “from old collection” | high drift / low confidence |

Important change:

> In Western markets, oral history is often treated as weak. In non-Western provenance, community testimony may be primary cultural evidence when the relevant knowledge system is oral rather than documentary.

The model must not automatically downgrade non-documentary evidence when the culture itself preserved authority through non-documentary means.

---

## 4. Colonial and Restitution Risk as a Distinct Variable

Non-Western provenance requires a variable not fully captured by ordinary legal title:

```text
Colonial / Restitution Risk = extraction context + claim environment + documentation gaps + power imbalance + legal exposure + ethical exposure
```

This variable should not be buried under general drift. It deserves explicit treatment.

### Colonial / Restitution Risk Indicators

- acquired during colonial administration;
- acquired by military personnel;
- acquired by missionary intermediaries;
- acquired during punitive expedition or conflict;
- acquired under unclear donor circumstances;
- exported without documented permit;
- entered market through colonial capital city;
- associated with named colonial agents;
- appears in restitution-sensitive category;
- claimed by source nation, community, heirs, or institution;
- has incomplete acquisition file;
- listed as “gift” without clear donor authority;
- removed from ceremonial, burial, sacred, or community context;
- connected to looting, forced sale, seizure, coercion, or asymmetric power conditions.

Suggested scoring:

```text
Restitution Risk Score =
  0.25 × Acquisition Context Risk
+ 0.20 × Documentation Gap Risk
+ 0.20 × Claim / Dispute Risk
+ 0.15 × Agent Risk
+ 0.10 × Object Category Sensitivity
+ 0.10 × Legal / Treaty Exposure
```

This score should act as a valuation modifier, liquidity modifier, and governance trigger.

---

## 5. Non-Western Data Opportunity Map

The current public data landscape is fragmented. That fragmentation is the opportunity.

### High-Value Target Data Sources

| Category | Potential Source Type | Why It Matters |
|---|---|---|
| African heritage | museum databases, restitution projects, colonial archives, national museum partnerships | high cultural significance, high provenance complexity |
| Asian art | national museum collections, temple records, collector archives, export permits, dealer catalogues | deep collecting histories, complex regional markets |
| Middle Eastern / Islamic art | museum records, manuscript catalogues, archaeological records, export documentation | major legal and cultural sensitivity |
| Latin American art | national archives, private collections, biennial records, modernist market data | growing market, under-modeled regional networks |
| Indigenous / First Nations | community-led repositories, museum repatriation records, oral histories | cultural authority may sit outside formal market documentation |
| Oceanic art | expedition records, museum inventories, anthropological archives | highly sensitive acquisition context |
| Colonial-era collections | administrative records, military records, missionary records, donor files | essential for extraction-context modeling |

---

## 6. Digital Art Is the Second Missing Corpus

Digital art solves some provenance problems and creates others.

Blockchain can provide:

- timestamped minting;
- wallet transfer history;
- transaction record;
- royalty structure;
- edition count;
- smart contract address;
- token ownership;
- marketplace sale history.

But blockchain does not automatically prove:

- real artist identity;
- human creative contribution;
- underlying media authenticity;
- training data rights;
- model provenance;
- off-chain file permanence;
- whether the minter had authority;
- whether metadata was altered;
- whether the token points to the correct asset;
- whether wallet transfers reflect true sales or self-dealing;
- whether wash trading inflated value.

The key principle:

> Blockchain verifies a record. It does not automatically verify the truth of the claim inside the record.

Therefore digital art provenance needs both on-chain and off-chain scoring.

---

## 7. Digital / AI Art Chain-of-Custody Model

For AI-generated and digital art, the chain begins before minting.

A complete chain should include:

```text
Concept / Intent
  → Prompt / Creative Direction
  → Model Used
  → Model Version
  → Dataset / Training Context
  → Generation Event
  → Human Selection / Curation
  → Post-Production
  → Master File Creation
  → Hash / Storage / Metadata
  → Mint / Registry / Certificate
  → Primary Sale
  → Secondary Transfers
  → Exhibition / Display History
  → Conservation / Migration / Reformatting
  → Current Holder / Rights Status
```

This model makes AI art valuation substantially more nuanced than ordinary NFT price history.

### AI Art Evidence Tiers

| Tier | Evidence Class | Example Evidence | Model Treatment |
|---|---|---|---|
| A | Artist-authenticated creation record | signed artist statement, studio log, prompt/workflow archive, dated master file | strongest AI authorship evidence |
| B | Cryptographic origin record | hash, signed certificate, C2PA credential, verified mint, trusted timestamp | strong technical evidence |
| C | Workflow transparency | model version, prompt chain, seed, edits, post-production log | supports reproducibility and authorship clarity |
| D | Platform verification | curated marketplace, gallery-backed listing, institutional digital repository | market credibility, not proof alone |
| E | Exhibition / institutional validation | museum show, digital biennial, gallery exhibition, academic publication | cultural validation |
| F | Transaction history | primary sale, secondary sale, wallet transfers, auction result | market evidence; needs wash-trade analysis |
| G | Social / resonance evidence | saves, shares, mentions, derivative works, collector discourse | cultural signal, manipulation-sensitive |
| H | Off-chain media storage | IPFS, Arweave, institutional archive, redundant storage | permanence evidence |
| I | Informal creator claim | social post, Discord announcement, website listing | useful but lower evidentiary weight |
| J | Unverified token / weak metadata | anonymous mint, broken link, no artist confirmation, vague collection claim | high drift / low confidence |

---

## 8. Digital Art Risk Variables

Digital and AI art introduce new risk categories.

### Digital Drift

```text
Digital Drift = metadata decay + link rot + platform dependency + smart contract risk + storage fragility + identity uncertainty
```

### AI Authorship Risk

```text
AI Authorship Risk = unclear prompt author + unclear model + unclear dataset + weak human curation + weak rights position
```

### Token / Media Separation Risk

```text
Token-Media Separation Risk = token exists but underlying media is missing, altered, inaccessible, or not legally controlled
```

### Wash Trading / Manipulation Risk

```text
Manipulation Risk = related-wallet transfers + circular sales + abnormal price jumps + low-identity buyers + marketplace incentive distortion
```

### Rights Risk

```text
Rights Risk = training data uncertainty + output ownership uncertainty + license ambiguity + commercial use restrictions + derivative-work exposure
```

These risks should modify valuation separately rather than being collapsed into a single “digital risk” field.

---

## 9. AI Art Market Opportunity

AI art is early, and early matters.

Traditional art categories have decades or centuries of sales comparisons. AI-generated art does not.

This creates a valuation problem:

- few true comparables;
- inconsistent auction treatment;
- uneven institutional acceptance;
- weak provenance standards;
- uncertain rights regimes;
- volatile collector sentiment;
- unclear definitions of authorship;
- no stable consensus on edition control;
- no mature condition/conservation standard for AI-native files.

But it also creates a market opportunity:

> The first robust AI art valuation framework can become the default language for the category.

The lack of comparables means the model should lean more heavily on:

- workflow integrity;
- authorial clarity;
- technical novelty;
- scarcity control;
- cultural resonance;
- institutional adoption;
- collector identity;
- platform credibility;
- storage permanence;
- rights clarity;
- evidence quality.

In other words, AI art valuation must be more like venture underwriting than traditional appraisal.

It should ask:

```text
Is this merely an output, or is it an early cultural asset with durable signal?
```

---

## 10. Revised Cultural Valuation Computation

Because AI art and non-Western art often lack stable market comparables, cultural valuation must be strengthened.

### Cultural Valuation Score

```text
Cultural Value Score = 100 × (
  0.18 × Cultural Specificity
+ 0.16 × Authorship / Community Authority
+ 0.14 × Evidence Quality
+ 0.12 × Resonance Persistence
+ 0.10 × Institutional Recognition
+ 0.10 × Interpretive Depth
+ 0.08 × Scarcity / Non-Reproducibility
+ 0.06 × Cross-Cultural Relevance
+ 0.06 × Future Research Potential
)
```

For AI art, substitute:

```text
Cultural Specificity → Visual / Conceptual Originality
Community Authority → Human Creative Direction
Evidence Quality → Workflow Integrity
Scarcity → Edition / Reproducibility Control
Future Research Potential → Technical / Historical Significance
```

### Cultural Valuation Multiplier

```text
Cultural Multiplier = 1 + ((Cultural Value Score - 50) / 100)
```

Examples:

- score 50 = neutral multiplier 1.00
- score 70 = multiplier 1.20
- score 85 = multiplier 1.35
- score 30 = multiplier 0.80

This multiplier should not override provenance or legal risk. It should amplify value only when governance is credible.

```text
Final Cultural Adjustment = Cultural Multiplier × Governance Confidence × Rights Confidence
```

This prevents the model from overvaluing culturally powerful works with unresolved title, rights, or restitution exposure.

---

## 11. Non-Western and Digital Data Build Plan

### Phase 1 — Corpus Discovery

Identify source corpora:

- African museum databases;
- Asian museum databases;
- provenance research projects;
- restitution databases;
- national collection APIs;
- colonial archives;
- digitized auction catalogues;
- dealer archives;
- NFT marketplace APIs;
- blockchain explorer data;
- artist websites;
- gallery announcements;
- institutional digital art records.

### Phase 2 — Entity Model

Create shared entities:

- artwork;
- maker;
- community;
- collector;
- dealer;
- institution;
- custodian;
- owner;
- agent;
- marketplace;
- token;
- smart contract;
- file asset;
- evidence source;
- event;
- claim.

### Phase 3 — Evidence-Tier Annotation

Each event receives:

- evidence tier;
- evidence type;
- source type;
- source date;
- event date;
- date precision;
- confidence score;
- contradiction flag;
- legal risk flag;
- restitution risk flag;
- digital risk flag;
- off-chain / on-chain status.

### Phase 4 — Chain Construction

Construct graph:

```text
Object/Asset → Events → Agents → Evidence → Claims → Risk Flags
```

### Phase 5 — Scoring and Stress Testing

Run:

- confidence decay over time;
- chain-depth analysis;
- missing-link detection;
- source-quality weighting;
- contradiction detection;
- multi-source attribution reconciliation;
- on-chain/off-chain mismatch detection;
- cultural valuation computation;
- risk-adjusted valuation banding.

### Phase 6 — Human Review

For sensitive categories:

- provenance specialist review;
- source-community consultation;
- legal review;
- curator review;
- digital-rights review;
- artist confirmation where possible.

---

## 12. PROV-O / Evidence-Tier Overlay

This framework can be represented on top of PROV-O.

### Core PROV-O Mapping

| Art Valuation Concept | PROV-O Concept |
|---|---|
| Artwork / token / master file | `prov:Entity` |
| Ownership transfer | `prov:Activity` |
| Custodian / owner / artist / dealer | `prov:Agent` |
| Generated artwork | `prov:wasGeneratedBy` |
| Used model / dataset / source | `prov:used` |
| Artist / model / platform attribution | `prov:wasAttributedTo` |
| Transfer influence | `prov:wasInfluencedBy` |
| Derived digital asset | `prov:wasDerivedFrom` |
| Chain update | `prov:wasRevisionOf` |
| Agent acting for institution | `prov:actedOnBehalfOf` |

### Evidence-Tier Overlay

PROV-O tells us that a claim exists. The evidence-tier overlay tells us how strong the claim is.

Suggested custom fields:

```yaml
evidence_tier: A-J
evidence_type: artist_origin | invoice | exhibition | oral_history | blockchain | archive | forensic | weak_signal
source_quality: primary | secondary | inferred | disputed
date_precision: exact | year | approximate | unknown
confidence_score: 0.00-1.00
cultural_authority_score: 0.00-1.00
legal_risk_score: 0.00-1.00
restitution_risk_score: 0.00-1.00
digital_drift_score: 0.00-1.00
```

### Confidence Decay

```text
Adjusted Confidence = Base Evidence Confidence × e^(-λ × Age) × Source Reliability × Contradiction Control
```

Where:

- **Base Evidence Confidence** comes from evidence tier;
- **Age** is time since event or source creation;
- **λ** changes by evidence type;
- **Source Reliability** adjusts for primary / secondary / inferred status;
- **Contradiction Control** penalizes conflicting claims.

Primary source records should decay slowly. Unverified market claims should decay quickly. Oral history should not be automatically penalized; it should be evaluated through cultural authority and corroboration.

---

## 13. Strategic Conclusion

Non-Western and digital art are not side cases. They are the frontier cases.

They expose the limitations of traditional appraisal because they force the model to confront:

- missing documents;
- colonial extraction;
- cultural authority;
- oral history;
- digital identity;
- AI authorship;
- platform risk;
- smart contracts;
- off-chain assets;
- chain-of-custody gaps;
- restitution exposure;
- market comparables that do not exist yet.

This is why the opportunity is so large.

> Western auction data teaches valuation history. Non-Western and digital provenance will define valuation infrastructure.

Shauna Lee Lange’s framework becomes strongest when it goes where the old market is weakest.

That means:

1. **Build the evidence-tier overlay.**
2. **Expand beyond Western auction comparables.**
3. **Model digital provenance as on-chain plus off-chain truth.**
4. **Treat cultural authority as a first-class signal.**
5. **Make risk visible instead of hiding it in narrative language.**
6. **Use AI to produce ranges, confidence scores, and audit trails, not magic numbers.**

The next market will not simply ask what art is worth.

It will ask:

```text
How strong is the signal?
How clean is the chain?
How credible is the evidence?
How durable is the culture?
How governable is the value?
```

That is the frontier.
