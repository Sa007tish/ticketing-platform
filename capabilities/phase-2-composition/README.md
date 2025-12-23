# Phase 2 — Capability Composition

**Status:** Enabled (Procedurally Incomplete)  
**Phase:** Phase 2 — Capability Composition  
**Audience:** Architects, Governance AIs, Auditors  
**Change Policy:** Append-only clarifications

---

## 1. PURPOSE

Phase 2 governs **safe interaction between frozen capabilities**.

Its purpose is to ensure that composition:

- Preserves determinism
- Preserves replay protection
- Preserves audit guarantees
- Prevents illegal cross-capability coupling
- Prevents silent bypass of governance logic

Phase 2 exists because **correct individual capabilities can still fail when composed**.

---

## 2. CURRENT EXECUTED REALITY

Phase 2 is **functionally enabled**.

The following has been executed and verified:

- Each frozen capability exposes an explicit `public.ts`
- Cross-capability imports are restricted to public surfaces
- No `src/**` imports occur across capability boundaries
- A Phase 2 composition test exists and is passing
- Replay protection survives composition
- Audit logging survives composition
- Deterministic execution survives composition
- CI is green

These guarantees are enforced by tests and manual review.

---

## 3. WHAT PHASE 2 GUARANTEES TODAY

At present, Phase 2 guarantees:

- Capability boundaries are respected by convention and review
- Public surfaces are the only legal integration points
- Core invariants (determinism, replay, audit) are preserved when:
  - Capability 1 consumes Capability 0

No other compositions are currently authorized.

---

## 4. WHAT PHASE 2 DOES NOT YET GUARANTEE

Phase 2 is **not procedurally complete**.

The following are **known gaps**:

- No formal Phase 2 charter document exists
- No reusable composition test template exists
- No negative composition tests exist for future capabilities
- No automated linting enforces import boundaries
- No standardized entry contract for new capabilities exists

These gaps are documented intentionally and must not be ignored.

---

## 5. HISTORICAL CONTEXT (NON-NORMATIVE)

Phase 2 composition work began before formal Phase-level documentation was produced.

This occurred due to:

- Urgency to validate cross-capability invariants
- Discovery of real risks during Capability 1 execution
- Correction of previously invented public exports

This is acknowledged **process debt**, not an architectural defect.

---

## 6. CONSTRAINTS ON FUTURE WORK

Until Phase 2 is procedurally formalized:

- No new capability may compose with others without explicit approval
- No capability may bypass public surfaces
- No feature logic may be introduced under the guise of composition
- All composition must be test-first and invariant-focused

Violations are constitutional breaches.

---

## 7. RELATION TO FUTURE PHASES

Phase 2 must be **procedurally completed** before:

- Phase 3 product domains begin
- More than two capabilities are composed
- External interfaces are introduced

Failure to do so risks silent invariant erosion.

---

**End of Phase 2 Composition README**
