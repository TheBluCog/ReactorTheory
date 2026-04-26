# UAP Engine (Unified Alignment Performance)

## Formula

UAP = (E × I × C) / D

## Normalization

All inputs must be normalized between 0 and 1.

## Deterministic Calculation

```ts
export function calculateUAP(E: number, I: number, C: number, D: number): number {
  if (D <= 0.0001) return E * I * C * 10;
  return (E * I * C) / D;
}
```

## Interpretation Bands

| UAP Score | Meaning |
|----------|--------|
| > 3.0 | High alignment / safe to execute |
| 1.5 - 3.0 | Moderate alignment / monitor |
| 0.5 - 1.5 | Risk / audit |
| < 0.5 | High risk / block or govern |

---

## Drift Override

```ts
if (D > (E * I * C)) {
  return "GOVERN";
}
```

This enforces RT9.1 control law.
