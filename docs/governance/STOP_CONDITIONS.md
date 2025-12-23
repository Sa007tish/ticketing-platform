# STOP CONDITIONS

**Status:** Binding  
**Authority Level:** Governance (Non-Constitutional)  
**Scope:** Global  
**Change Policy:** Rare, explicit rationale required

---

## Purpose

This document defines **STOP CONDITIONS** for the Ticketing Platform.

A STOP CONDITION is a state in which **no further work may proceed**
until the condition is explicitly resolved and documented.

STOP CONDITIONS exist to protect the system against:
- silent architectural drift
- AI hallucination
- rushed human decisions
- governance erosion under pressure

STOP CONDITIONS override:
- delivery pressure
- CI green status
- seniority
- confidence
- intent

---

## STOP-01: Missing Charter

**Trigger**

- A capability, phase, or major architectural change is being worked on
  without an approved charter.

**Rationale**

Prevents implicit authority and scope creep.

**Resolution**

Produce and approve the required charter.

---

## STOP-02: Repo-First Enumeration Not Performed

**Trigger**

- Reasoning about public APIs, imports, or contracts
  without enumerating actual exports from the repository.

**Rationale**

Prevents hallucinated interfaces and drift from ground truth.

**Resolution**

Enumerate real exports from the repository and document them.

---

## STOP-03: Frozen Artifact Modification

**Trigger**

Any change to a frozen artifact, including but not limited to:
- Capability 0 logic
- Capability 1 logic
- public.ts of frozen capabilities
- Canonical mutating function template
- Canonical tests

**Rationale**

Frozen artifacts are law-adjacent and protect system invariants.

**Resolution**

Provide explicit bug justification, impact analysis, and approval.

---

## STOP-04: Invariant Violation

**Trigger**

Any violation of constitutional invariants, including:
- non-deterministic execution
- missing replay protection
- missing or duplicated audit entries
- incorrect execution order

**Rationale**

These invariants define system correctness and survivability.

**Resolution**

Correct the design. Tests must not be weakened to pass CI.

---

## STOP-05: Cross-Capability Boundary Violation

**Trigger**

- Importing from another capability’s `src/**`
- Bypassing `public.ts`

**Rationale**

Prevents hidden coupling and unauthorized dependency.

**Resolution**

Refactor to public surface or stop work.

---

## STOP-06: Silent State Mutation

**Trigger**

Any state mutation without:
- audit logging
- replay registry entry
- explicit actor attribution

**Rationale**

Silent behavior destroys auditability and legal defensibility.

**Resolution**

Redesign mutation path to be explicit and auditable.

---

## Explicit Non-STOP Conditions

The following are **not** STOP CONDITIONS:
- CI failures
- Lint errors
- Performance regressions
- UX dissatisfaction

These are engineering issues, not governance halts.

---

## Final Rule

When a STOP CONDITION is triggered:
> **Work stops. Resolution is documented. Only then may work resume.**
