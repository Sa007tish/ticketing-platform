# Capability 1 — User Authentication

**Status:** ❄️ Frozen  
**Phase:** Phase 1 — Capability Foundations (Complete)  
**Audience:** Architects, Governance AIs, Auditors  
**Change Policy:** Bug fixes only, with explicit justification

---

## 1. PURPOSE

Capability 1 provides **user identity registration and authentication** for non-administrative users of the system.

It establishes a deterministic, auditable foundation for user identity that higher-level product capabilities may rely on.

Capability 1 does **not** define product behavior.
It defines **who a user is** and **how their identity is verified**.

---

## 2. DEPENDENCIES

Capability 1 depends on:

- **Capability 0 — Administrative Authority**, for:
  - authentication primitives
  - authorization enforcement
  - audit logging
  - replay protection

All interactions with Capability 0 occur **only through its public surface**.

No other dependencies are permitted.

---

## 3. POWERS OWNED

Capability 1 exclusively owns:

- User registration
- User authentication
- User identity persistence
- Validation of user authentication credentials

It may not delegate these responsibilities to other capabilities.

---

## 4. EXPLICIT NON-GOALS

Capability 1 must **never**:

- Implement authorization logic
- Assign or evaluate roles
- Access administrative identities
- Access business or product data
- Implement consent, events, tickets, payments, or orders
- Perform financial operations
- Enforce product-level policies

It is intentionally **identity-only**.

---

## 5. EXECUTION CONSTRAINTS

- All mutating actions follow the **canonical mutating function template**
- Determinism is mandatory
- All time and identifiers are injected
- Replay detection occurs before mutation
- Exactly one audit log entry is produced per attempted action
- Exactly one replay registry entry is produced per action

These constraints are enforced by tests.

---

## 6. PUBLIC SURFACE

Capability 1 exposes a **strictly enumerated public surface** via `public.ts`.

Rules:

- Only symbols exported in `public.ts` may be consumed by other capabilities
- Public exports were enumerated against real implementation files
- Invented exports are forbidden
- No `src/**` imports are allowed across capability boundaries

This public surface is **frozen**.

---

## 7. HISTORICAL FAILURE MODES (LOCKED)

Capability 1 exposed real, historical failure modes that are now explicitly guarded against:

- Interface drift between tests and implementation
- Assumed exports that did not exist
- Incorrect error-name assumptions
- Misuse of deterministic ID generators
- Import-path boundary violations
- Missing production validation
- Over-reliance on CI green status

These failures informed permanent governance rules.

They must not be reintroduced.

---

## 8. FROZEN STATUS

Capability 1 is **frozen**.

The following may not be modified:

- Core logic
- Public surface
- Canonical tests
- Execution order

Only explicitly justified bug fixes are allowed.
Refactors, cleanups, or redesigns are forbidden.

---

## 9. RATIONALE FOR RIGIDITY

Capability 1 is intentionally rigid because:

- Identity errors propagate system-wide
- Authentication must be auditable
- Replay safety must be guaranteed
- Silent failure is unacceptable

Flexibility here would compromise downstream capabilities.

---

**End of Capability 1 README**
