# Architectural Decision Index

**Status:** Authoritative  
**Scope:** System-wide  
**Audience:** Architects, Principal Engineers, Auditors, Governance AIs  
**Change Policy:** Append-only (decisions may be superseded, never erased)

---

## 1. PURPOSE

This document is the **institutional memory** of the Ticketing Platform.

It records **architectural decisions that must not be rediscovered, re-litigated,
or silently reversed**, especially under AI-assisted or high-churn development.

This document exists to ensure that:
- future humans and AIs can continue work without oral history
- irreversible decisions are explicit
- deferred decisions are not forgotten
- architectural intent survives personnel and AI turnover

If this document conflicts with informal reasoning or assumptions,
**this document prevails**.

---

## 2. DECISION MODEL

Each decision recorded here is classified as one of:

- **Irreversible** — must never be changed retroactively
- **Forward-only** — may evolve, but history remains valid
- **Deferred-but-Mandatory** — explicitly postponed, but required later
- **Rejected** — consciously excluded, with rationale

Every decision records:
- context
- decision
- rationale
- consequences
- future implications

---

## 3. GLOBAL ARCHITECTURAL DECISIONS

### AD-001 — Governance-First Core

**Decision:**  
The system is governance-first and correctness-first at its core.

**Rationale:**  
The platform handles money, tickets, inventory, and legally relevant events.
Errors are permanent and must be reconstructable.

**Consequences:**  
- invariants override convenience
- CI green does not imply correctness
- auditability and replay safety are mandatory

**Status:** Irreversible

---

### AD-002 — Determinism & Replay Safety

**Decision:**  
All core execution must be deterministic, replay-safe, and auditable.

**Rationale:**  
Legal defensibility and financial reconstruction require identical inputs
to produce identical outcomes.

**Consequences:**  
- no randomness
- no hidden clocks
- all time and IDs injected
- replay detection before mutation

**Status:** Irreversible

---

### AD-003 — Policy vs Outcome Separation

**Decision:**  
Policies are mutable. Outcomes are immutable.

**Definition:**  
- **Policy**: rules, pricing logic, fee schedules, eligibility criteria, algorithms
- **Outcome**: issued tickets, charged prices, refunds, payouts, audit records

**Rationale:**  
Business rules evolve. Historical facts must not.

**Consequences:**  
- policies are evaluated at decision time
- outcomes are recorded as facts
- outcomes are never recomputed retroactively

**Status:** Irreversible

---

### AD-004 — Forward-Only Evolution

**Decision:**  
All system evolution is forward-only.

**Rationale:**  
Retroactive mutation destroys auditability and legal trust.

**Consequences:**  
- corrections occur via compensating actions
- mistakes are acknowledged, not erased

**Status:** Irreversible

---

### AD-005 — No Hardcoded Economics

**Decision:**  
Pricing, fees, tiers, and economic logic must never be hardcoded into core logic.

**Rationale:**  
Economic models evolve and must remain changeable without code rewrites.

**Consequences:**  
- no fixed prices embedded in logic
- no fee assumptions in core
- economics expressed as policy inputs

**Status:** Forward-only

---

### AD-006 — Capability-Based Architecture

**Decision:**  
The system is composed of isolated capabilities with explicit public surfaces.

**Rationale:**  
Isolation prevents accidental coupling and enables safe evolution.

**Consequences:**  
- only `public.ts` may be imported across capabilities
- internal `src/**` is private
- capabilities freeze after Phase 1

**Status:** Irreversible

---

### AD-007 — AI as Untrusted Actor

**Decision:**  
All AI-generated output is treated as untrusted until audited.

**Rationale:**  
AI systems may hallucinate, forget context, or optimize incorrectly.

**Consequences:**  
- repo-first enumeration rule
- role separation (governance AI vs coding AI)
- STOP CONDITIONS apply equally to AI and humans

**Status:** Irreversible

---

## 4. TEMPORAL DECISIONS

### AD-008 — Time-of-Decision Evaluation

**Decision:**  
All policies are evaluated at the time an action is executed.

**Rationale:**  
Legal and financial correctness depends on the rules in force at that moment.

**Consequences:**  
- policy versions are referenced
- outcomes record their evaluation context

**Status:** Irreversible

---

### AD-009 — Law Is Temporal

**Decision:**  
Legal and regulatory rules are temporal and jurisdictional.

**Rationale:**  
Law changes over time; past actions must be judged under past law.

**Consequences:**  
- law is not baked into the Constitution
- compliance logic is versioned

**Status:** Forward-only

---

## 5. REJECTED DECISIONS

### AD-R01 — Retroactive Data Fixes

**Decision:** Rejected  
**Rationale:**  
Retroactive mutation breaks trust, auditability, and legality.

---

### AD-R02 — UI as Source of Truth

**Decision:** Rejected  
**Rationale:**  
UI is perimeter-only and must never mutate core state directly.

---

## 6. AMENDMENT RULE

New decisions may be added.
Existing decisions may be superseded with explicit rationale.
No decision may be silently removed.

---

**End of Architectural Decision Index**
