# Canonical Deployment Ledger (CDL)

**Project:** Reactor Theory  
**Repository:** `TheBluCog/ReactorTheory`  
**Canonical Branch:** `main`  
**Current Stack:** RT11 / ARTYMUS 3.0.1 / Ethic Vault  
**License:** Ethic Vault Agentic License / Open Agentic Framework agreement  
**Last Updated:** 2026-05-06

---

## CDL Status

```yaml
cdl:
  id: CDL-REACTOR-THEORY-RT11-ARTYMUS-3.0.1
  status: ACTIVE
  branch: main
  production_url: https://reactor-theory.vercel.app
  branch_url: https://reactor-theory-git-main-theblucogs-projects.vercel.app
  canonical_api_route: api/artymus.ts
  removed_route: api/artymus/index.ts
  license: Ethic Vault Agentic License / Open Agentic Framework agreement
```

---

## Canonical URLs

```text
Production UI:
https://reactor-theory.vercel.app

Branch UI:
https://reactor-theory-git-main-theblucogs-projects.vercel.app

ARTYMUS API Root:
https://reactor-theory.vercel.app/api/artymus

ARTYMUS API Health:
https://reactor-theory.vercel.app/api/artymus?action=health

ARTYMUS API Links:
https://reactor-theory.vercel.app/api/artymus?action=links
```

---

## Current Verified Fixes

| Area | Status | Notes |
|---|---:|---|
| Node runtime | `24.x` | `package.json` aligned to Vercel project runtime |
| React typings | fixed | `@types/react` and `@types/react-dom` restored |
| Node typings | fixed | `@types/node` added for CI type-check |
| Playwright typings | fixed | `@playwright/test` included |
| Reown peer conflict | removed | Reown / adapter packages removed from current dependency stack |
| ARTYMUS API | active | flat Vercel route at `api/artymus.ts` |
| nested API ambiguity | removed | `api/artymus/index.ts` deleted |
| Vercel API fallback | guarded | explicit `/api/artymus` routing before SPA fallback |
| UI shell | active | compact mobile-first command center |
| README | updated | RT11, ARTYMUS, API, CI, license, PR safety rules documented |

---

## Canonical Commit Log

```text
24a3515b36e99f01ac07236e2128ae34ec037380
- Removed nested ARTYMUS API route so flat Vercel JSON endpoint wins.

16d9d826f931c2c6301431635ebbc2b9413fe491
- Forced ARTYMUS JSON API before SPA fallback in vercel.json.

dd2e88cb90f1dcdb5be8f0f27f207ad604ec29af
- Updated README with RT11, ARTYMUS API, deployment, and Ethic Vault license status.

d9087c871ab3fe850ce21c7066789eabfd724b45
- Added @types/node and updated license string in package.json.

7461c8df0fadbc1c8406410aeb282bbcd5875fc2
- Stabilized TypeScript config for explicit React / Node / Playwright types.
```

---

## ARTYMUS JSON Contract

Expected root payload:

```json
{
  "ok": true,
  "service": "ARTYMUS",
  "version": "3.0.1",
  "stack": "RT11",
  "mode": "demo/testnet-next",
  "status": "LIVE",
  "route": "/api/artymus.ts"
}
```

Expected health payload:

```json
{
  "ok": true,
  "service": "ARTYMUS",
  "version": "3.0.1",
  "stack": "RT11",
  "mode": "demo/testnet-next",
  "status": "LIVE",
  "health": "green"
}
```

---

## Governance / License Rule

All RT11, ARTYMUS, wallet, payout, proof, API, governance, and agentic execution surfaces must remain governed by the **Ethic Vault Agentic License** and the **Open Agentic Framework agreement**.

Required preserved properties:

1. governance-first use
2. auditability
3. attribution
4. safe deployment constraints
5. non-bypass execution controls
6. proof continuity
7. human-operable review
8. demo-first execution posture

---

## Pull Request Merge Gate

Before merging PRs that touch execution, wallet behavior, payout logic, proof handling, API routing, TypeScript configuration, dependency state, or deployment configuration:

```text
1. Rebase onto latest main.
2. Preserve package.json, tsconfig.json, vercel.json, and api/artymus.ts fixes.
3. Regenerate package-lock.json from clean install.
4. Default execution mode must be demo.
5. Placeholder addresses cannot execute transactions.
6. Proof UI must follow the site design system.
7. Ethic Vault Agentic License continuity must be preserved.
```

---

## Deployment Instruction

For Vercel deployment after API or routing changes:

```text
Redeploy -> Use existing Build Cache: OFF
```

or:

```bash
vercel --prod --force
```

---

## CDL Verdict

```text
SYSTEM: ACTIVE
STACK: RT11 / ARTYMUS 3.0.1
GOVERNANCE: ETHIC VAULT
API ROUTE: FLAT / CANONICAL
MERGE POLICY: CONTROLLED
STATUS: READY FOR CLEAN DEPLOY
```
