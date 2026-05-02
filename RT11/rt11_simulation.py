"""
RT11 Simulation — Resonance Economics & Universal Contribution Infrastructure
Version: RT11.1 Polygon Governance Draft Simulation

Purpose:
- Simulate contribution scoring using UAP = (E * I * C) / D
- Simulate Resonance = ((E * I * C) * NetworkImpact) / (Drift * Entropy)
- Update Cred-NFT-like reputation state
- Route treasury funds through 80/20 model
- Allocate dynamic UBI using baseline + resonance-weighted augmentation
- Track civilization stability over time

This is a mathematical / governance simulation only.
It does not connect to Polygon, wallets, or smart contracts directly.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List
import random
import math
import statistics

EPSILON = 1e-9

RT11_CHAIN_METADATA = {
    "primary_treasury_wallet": "0x27f780E6d46dF69347f954674bbDF39924e3D644",
    "polygon_idm_from": "0x5c90e838c809b7c5b91a41b3271599ae2172d23e",
    "polygon_idm_to": "0x09522b7807bb8ebfddcd5efffaacc742a660bfbd",
    "canonical_anchor_tx": "0x9971c17e2d9638cbb63a2d2670db69fa4f335a8a98b222777a3838acf0b2b3e8",
    "network": "Polygon",
    "model": "RT11.1 Resonance Economics Simulation",
}


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def uap(E: float, I: float, C: float, D: float) -> float:
    return (E * I * C) / max(D, EPSILON)


def resonance(E: float, I: float, C: float, D: float, network_impact: float, entropy: float) -> float:
    return ((E * I * C) * network_impact) / max(D * entropy, EPSILON)


def civilization_stability(trust: float, cooperation: float, alignment: float, entropy: float) -> float:
    return (trust * cooperation * alignment) / max(entropy, EPSILON)


@dataclass
class CredNFTState:
    contribution_graph: float = 0.0
    resonance_score: float = 0.0
    entropy_index: float = 0.0
    ubi_rights_weight: float = 1.0
    audit_events: List[Dict] = field(default_factory=list)


@dataclass
class Agent:
    name: str
    role: str
    E: float
    I: float
    C: float
    D: float
    network_impact: float
    entropy: float
    cred: CredNFTState = field(default_factory=CredNFTState)

    def step(self, epoch: int) -> Dict:
        self.E = clamp(self.E + random.uniform(-0.8, 1.2), 0.1, 10.0)
        self.I = clamp(self.I + random.uniform(-0.04, 0.04), 0.05, 1.0)
        self.C = clamp(self.C + random.uniform(-0.05, 0.05), 0.05, 1.0)
        self.D = clamp(self.D + random.uniform(-0.05, 0.10), 0.05, 5.0)
        self.network_impact = clamp(self.network_impact + random.uniform(-0.05, 0.08), 0.05, 5.0)
        self.entropy = clamp(self.entropy + random.uniform(-0.04, 0.06), 0.05, 5.0)

        score_uap = uap(self.E, self.I, self.C, self.D)
        score_r = resonance(self.E, self.I, self.C, self.D, self.network_impact, self.entropy)
        entropy_penalty = max(0.0, self.D * (1.0 - self.C))

        self.cred.contribution_graph += self.E
        self.cred.resonance_score += score_r
        self.cred.entropy_index += entropy_penalty

        raw_weight = 1.0 + math.log1p(max(self.cred.resonance_score, 0.0)) - 0.15 * self.cred.entropy_index
        self.cred.ubi_rights_weight = clamp(raw_weight, 0.25, 10.0)

        event = {
            "epoch": epoch,
            "agent": self.name,
            "role": self.role,
            "E": round(self.E, 4),
            "I": round(self.I, 4),
            "C": round(self.C, 4),
            "D": round(self.D, 4),
            "network_impact": round(self.network_impact, 4),
            "entropy": round(self.entropy, 4),
            "UAP": round(score_uap, 4),
            "R": round(score_r, 4),
            "entropy_penalty": round(entropy_penalty, 4),
            "cred_resonance_total": round(self.cred.resonance_score, 4),
            "cred_entropy_total": round(self.cred.entropy_index, 4),
            "ubi_weight": round(self.cred.ubi_rights_weight, 4),
        }
        self.cred.audit_events.append(event)
        return event


@dataclass
class TreasuryConfig:
    inflow_per_epoch: float = 1000.0
    ubi_and_public_goods_share: float = 0.80
    operators_and_governance_share: float = 0.20
    ubi_baseline_share: float = 0.50
    resonance_augmented_share: float = 0.50


@dataclass
class TreasuryResult:
    epoch: int
    inflow: float
    ubi_public_goods_pool: float
    operator_governance_pool: float
    baseline_per_agent: float
    payouts: Dict[str, float]
    total_paid: float


def allocate_treasury(epoch: int, agents: List[Agent], config: TreasuryConfig) -> TreasuryResult:
    inflow = config.inflow_per_epoch
    ubi_public_goods_pool = inflow * config.ubi_and_public_goods_share
    operator_governance_pool = inflow * config.operators_and_governance_share

    baseline_pool = ubi_public_goods_pool * config.ubi_baseline_share
    augmentation_pool = ubi_public_goods_pool * config.resonance_augmented_share
    baseline_per_agent = baseline_pool / max(len(agents), 1)
    total_weight = sum(a.cred.ubi_rights_weight for a in agents)

    payouts = {}
    for a in agents:
        augmentation = augmentation_pool * (a.cred.ubi_rights_weight / max(total_weight, EPSILON))
        payouts[a.name] = round(baseline_per_agent + augmentation, 4)

    return TreasuryResult(epoch, inflow, round(ubi_public_goods_pool, 4), round(operator_governance_pool, 4), round(baseline_per_agent, 4), payouts, round(sum(payouts.values()), 4))


def compute_system_state(agents: List[Agent]) -> Dict:
    avg_I = statistics.mean(a.I for a in agents)
    avg_C = statistics.mean(a.C for a in agents)
    avg_D = statistics.mean(a.D for a in agents)
    avg_entropy = statistics.mean(a.entropy for a in agents)
    avg_resonance = statistics.mean(max(a.cred.resonance_score, 0.0) for a in agents)

    trust = clamp((avg_I + avg_C) / 2.0, 0.0, 1.0)
    cooperation = clamp(avg_resonance / (avg_resonance + 25.0), 0.0, 1.0)
    alignment = clamp(avg_I, 0.0, 1.0)
    entropy = clamp((avg_D + avg_entropy) / 2.0, 0.05, 5.0)
    stability = civilization_stability(trust, cooperation, alignment, entropy)

    return {"trust": round(trust, 4), "cooperation": round(cooperation, 4), "alignment": round(alignment, 4), "entropy": round(entropy, 4), "civilization_stability": round(stability, 4)}


def build_default_agents() -> List[Agent]:
    return [
        Agent("TeacherNode", "Education", 7.0, 0.92, 0.88, 0.45, 1.4, 0.60),
        Agent("CareNode", "Caregiving", 6.5, 0.95, 0.90, 0.35, 1.5, 0.50),
        Agent("BuilderNode", "Infrastructure", 8.0, 0.82, 0.80, 0.70, 1.8, 0.80),
        Agent("SafetyNode", "AI Alignment", 7.5, 0.90, 0.86, 0.50, 2.0, 0.65),
        Agent("NoiseNode", "Extraction / Drift", 8.5, 0.35, 0.30, 2.50, 0.55, 2.20),
        Agent("MediatorNode", "Conflict Resolution", 5.5, 0.93, 0.92, 0.30, 1.7, 0.45),
    ]


def run_simulation(epochs: int = 12, seed: int = 11) -> Dict:
    random.seed(seed)
    agents = build_default_agents()
    treasury_config = TreasuryConfig()
    audit_log = []
    treasury_log = []
    system_log = []

    for epoch in range(1, epochs + 1):
        for agent in agents:
            audit_log.append(agent.step(epoch))
        treasury_result = allocate_treasury(epoch, agents, treasury_config)
        treasury_log.append(treasury_result)
        system_state = compute_system_state(agents)
        system_state["epoch"] = epoch
        system_log.append(system_state)

    return {"metadata": RT11_CHAIN_METADATA, "audit_log": audit_log, "treasury_log": treasury_log, "system_log": system_log, "agents": agents}


def print_report(results: Dict) -> None:
    print("RT11 SIMULATION REPORT")
    print("=" * 72)
    print("Chain Metadata")
    for k, v in results["metadata"].items():
        print(f"{k}: {v}")

    print("\nFinal Civilization State")
    final_state = results["system_log"][-1]
    for k, v in final_state.items():
        print(f"{k}: {v}")

    print("\nFinal Cred-NFT State")
    for agent in results["agents"]:
        print(f"{agent.name:14s} | role={agent.role:22s} | resonance={agent.cred.resonance_score:9.3f} | entropy={agent.cred.entropy_index:7.3f} | ubi_weight={agent.cred.ubi_rights_weight:6.3f}")

    print("\nFinal Epoch Treasury Payouts")
    final_treasury = results["treasury_log"][-1]
    print(f"inflow: {final_treasury.inflow}")
    print(f"UBI + public goods pool: {final_treasury.ubi_public_goods_pool}")
    print(f"operator + governance pool: {final_treasury.operator_governance_pool}")
    print(f"baseline per agent: {final_treasury.baseline_per_agent}")
    for name, payout in final_treasury.payouts.items():
        print(f"{name:14s}: {payout}")

    print("\nSystem Stability Over Time")
    for row in results["system_log"]:
        print(f"epoch={row['epoch']:02d} | trust={row['trust']} | coop={row['cooperation']} | entropy={row['entropy']} | stability={row['civilization_stability']}")


if __name__ == "__main__":
    print_report(run_simulation())
