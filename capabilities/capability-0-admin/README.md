# Capability 0 — Administrative Authority (Root of Trust)

**Status:** ❄️ Frozen  
**Phase:** Phase 1 — Capability Foundations (Complete)  
**Audience:** Architects, Governance AIs, Auditors  
**Change Policy:** Bug fixes only, with explicit justification

---

## 1. PURPOSE

Capability 0 establishes the **root of trust** for the entire system.

All other capabilities depend on Capability 0.
Capability 0 depends on **nothing**.

Its sole purpose is to provide **governance, identity, authorization, and audit guarantees** that no other capability may implement independently.

---

## 2. POWERS OWNED (EXCLUSIVE)

Capability 0 exclusively owns:

- Administrator identity creation
- Administrator authentication
- Administrator authorization
- Role assignment and revocation
- Audit logging
- Replay protection

No other capability may:
- authenticate administrators
- authorize privileged actions
- write audit logs
- register replay entries

Any attempt to duplicate these responsibilities is a constitutional violation.

---

## 3. EXPLICIT NON-GOALS

Capability 0 must **never**:

- Access business or product data
- Contain event, ticket, payment, or user-domain logic
- Perform financial calculations
- Initiate product workflows
- Depend on any other capability

It is intentionally **governance-only**.

---

## 4. STRUCTURAL CONSTRAINTS

- The presence of a `src/` directory is **mandatory and intentional**
- Executable domain logic must reside in `src/`
- Test files must enforce constitutional invariants
- Import paths are strictly controlled

These constraints are enforced by tests, not convention.

---

## 5. CANONICAL MUTATING FUNCTION TEMPLATE

All mutating functions in Capability 0 follow the **canonical mutating function template**, in this exact order:

1. Replay detection  
2. Authentication  
3. Authorization  
4. Validation  
5. State mutation  
6. Audit log entry (**exactly one**)  
7. Replay registry entry (**exactly one**)  
8. Return or throw  

No deviation is permitted.

---

## 6. PUBLIC SURFACE

Capability 0 exposes a **strictly enumerated public surface** via `public.ts`.

Rules:

- Only symbols explicitly exported in `public.ts` may be imported by other capabilities
- No `src/**` imports are permitted across capability boundaries
- Public exports were verified against real implementation files
- Invented exports are forbidden

This public surface is **frozen**.

---

## 7. FROZEN STATUS

Capability 0 is **frozen**.

The following may not be modified:

- Core logic
- Public surface
- Canonical tests
- Execution order

Only explicitly justified bug fixes are allowed.
Refactors, cleanups, o
