# RT11 API Endpoint Test Links

Base URL:

```text
https://reactorcore.vercel.app
```

---

## 1. State Endpoint

Browser link:

```text
https://reactorcore.vercel.app/api/rt11/state
```

Curl:

```bash
curl -L -f "https://reactorcore.vercel.app/api/rt11/state"
```

Expected response shape:

```json
{
  "system": "RT11",
  "status": "LIVE",
  "mode": "TESTNET"
}
```

---

## 2. Score Endpoint

Curl:

```bash
curl -L -f -X POST "https://reactorcore.vercel.app/api/rt11/score" \
  -H "Content-Type: application/json" \
  -d '{"E":900,"I":0.92,"C":0.88,"D":0.24}'
```

JavaScript fetch:

```js
fetch("https://reactorcore.vercel.app/api/rt11/score", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ E: 900, I: 0.92, C: 0.88, D: 0.24 })
})
  .then(res => res.json())
  .then(console.log)
```

Expected response shape:

```json
{
  "UAP": 3036,
  "classification": "OPTIMAL"
}
```

---

## 3. Simulation Endpoint

Browser link:

```text
https://reactorcore.vercel.app/api/rt11/simulate
```

Curl:

```bash
curl -L -f "https://reactorcore.vercel.app/api/rt11/simulate"
```

Expected response shape:

```json
{
  "treasury": 900000000,
  "distribution": {
    "sponsor": 225,
    "institutional": 150,
    "regD": 125,
    "regS": 75,
    "debt": 325
  },
  "status": "SIMULATION"
}
```

---

## 4. Dashboard Link

```text
https://reactorcore.vercel.app/ui/rt11-dashboard.html
```

---

## 5. Quick Smoke Test Sequence

```bash
curl -L -f "https://reactorcore.vercel.app/api/rt11/state"

curl -L -f -X POST "https://reactorcore.vercel.app/api/rt11/score" \
  -H "Content-Type: application/json" \
  -d '{"E":900,"I":0.92,"C":0.88,"D":0.24}'

curl -L -f "https://reactorcore.vercel.app/api/rt11/simulate"
```
