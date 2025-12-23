# Pre-Capability 2 Handover — Authoritative State Snapshot

**Audience:** Successor AI, Architects, Auditors  
**Status:** Authoritative  
**Scope:** Defines the only approved starting point for Capability 2

---

## 1. PURPOSE OF THIS DOCUMENT

This document provides a **cold-start, authoritative snapshot** of the system state immediately before beginning **Capability 2**.

It exists to ensure that:
- no prior context is reinterpreted
- no frozen decisions are re-litigated
- no executed guarantees are weakened
- Capability 2 begins from verified reality, not narrative memory

If any other document or conversation conflicts with this one, **this document prevails** for Capability 2 entry.

---

## 2. GLOBAL SYSTEM STATUS (AUTHORITATIVE)

- Phase 0 (Constitution): ✅ Complete and immutable
- Capability 0 (Administrative Authority): ❄️ Frozen
- Capability 1 (User Authentication): ❄️ Frozen
- Phase 1: Functionally complete, procedurally closed retroactively
- Phase 2: Enabled, procedurally incomplete
- CI: Green
- Governance rules: Enforced

No feature work beyond Capability 1 exists.

---

## 3. FROZEN ARTIFACTS (DO NOT TOUCH)

The following are frozen and may not be modified except for explicitly justified bug fixes:

- Capability 0 logic, tests, and public surface
- Capability 1 logic, tests, and public surface
- Canonical mutating function template
- Phase 2 composition test
- Governance documentation

Any attempt to refactor, clean up, or reinterpret these artifacts is a constitutional violation.

---

## 4. PHASE 2 — CURRENT REALITY

Phase 2 is **enabled** but **procedurally incomplete**.

### What Exists

- `public.ts` enforced for cross-capability imports
- No `src/**` imports across capability boundaries
- Composition test verifying replay, audit, and determinism invariants
- Manual review as the primary boundary guard

### What Is Missing (Known and Accepted)

- Phase 2 charter
- Reusable composition test templates
- Negative composition tests
- Automated import-boundary linting

These gaps are known and must be addressed explicitly if Phase 2 is extended.

---

## 5. AUTHORIZED NEXT WORK FOR SUCCESSOR AI

The successor AI is authorized to:

1. Formalize Phase 2 procedurally:
   - Phase 2 charter
   - Entry contracts
   - Composition test templates
2. Draft Capability 2 — Phase 1A charter
3. Define Phase 1B canonical test specifications for Capability 2
4. Review and audit coding AI output for Capability 2

All work must respect frozen artifacts and constitutional rules.

---

## 6. NOT AUTHORIZED

The successor AI must **not**:

- Modify Capability 0 or Capability 1 behavior
- Reinterpret the Constitution
- Introduce product logic
- Bypass public surfaces
- Optimize or refactor existing code
- Assume intent without repo enumeration

CI green does not imply correctness.

---

## 7. AI ROLE SEPARATION (MANDATORY)

Two AI roles exist:

### Governance / Review AI
- Authors charters and documentation
- Defines invariants and constraints
- Reviews code against specs
- Audits AI-generated output

### Coding AI
- Writes code only
- Implements exactly what tests require
- Never authors documentation
- Never interprets governance intent

Role separation is mandatory.

---

## 8. FINAL INSTRUCTION TO SUCCESSOR AI

This system is intentionally rigid.

If something feels:
- too strict
- too verbose
- over-engineered

That is by design.

Proceed only from verified ground truth.
Do not infer.
Do not improvise.
Do not optimize.

---

**End of Pre-Capability 2 Handover**
