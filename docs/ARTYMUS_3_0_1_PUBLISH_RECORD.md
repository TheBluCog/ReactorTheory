# ARTYMUS 3.0.1 Publish Record

**Authorization:** DUNPHYG OMEGA VANTA BLACK  
**Status:** Stored on GitHub  
**Repository:** https://github.com/TheBluCog/ReactorTheory  
**Deployment Target:** https://reactor-theory.vercel.app  
**Version:** ARTYMUS 3.0.1  

---

## Published Runtime Model

ARTYMUS 3.0.1 uses a consolidated Vercel Hobby-safe API runtime.

Canonical endpoint:

```text
/api/artymus?action=...
```

Canonical actions:

```text
auth
protected-example
command
autonomous
governor
runtime-state
runtime-loop
governance-loop
live-loop
distributed-node
distributed-consensus
global-node
global-sync
```

---

## Canonical Public Surfaces

```text
/ui/shauna-operator-login.html
/ui/shauna-operator-app.html
/ui/artymus-control-room.html
/ui/artymus-command-layer.html
```

---

## Shauna / Maybe Surface Doctrine

```text
Maybe
Art Consultancy
Shauna Lee Lange

Bespoke art advisory for ultra high net worth individuals.

Discerning. Exclusive. Mysterious.
Japanese inspired. Elegant. Wabi-sabi.
Curation · Acquisition · Placement
```

Access doctrine:

```text
Collector -> feels
Advisor   -> interprets
Operator  -> acts
```

Brand anchors:

```text
Professional Art -> https://www.instagram.com/shaunaleelangeart
NPC / Company    -> https://www.yourNPC.art
```

---

## Published Spec

```text
docs/ARTYMUS_3_0_SPEC.md
```

Spec status:

```text
Verified and updated for consolidated runtime architecture.
```

---

## Deployment Notes

The consolidated API was introduced to prevent Vercel Hobby plan serverless-function sprawl.

Old route-style APIs under `/api/artymus/*` are considered migration artifacts unless explicitly retained.

New code should route through:

```text
/api/artymus?action=auth
/api/artymus?action=command
/api/artymus?action=runtime-state
/api/artymus?action=global-sync
```

---

## Canonical Summary

```text
Art is the surface.
Trust is the gate.
Risk is the judge.
Defense is the boundary.
Runtime is the memory.
Consensus is the network.
```
