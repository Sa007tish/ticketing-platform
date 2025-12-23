# SYSTEM CONSTITUTION  
**Ticketing Platform — Governance & Invariants**

**Status:** Immutable  
**Scope:** Global (Overrides all code and documentation)  
**Audience:** Architects, Principal Engineers, Auditors, Governance AIs  
**Change Policy:** Amendment-only (see `AMENDMENTS_LOG.md`)

---

## 1. PURPOSE

This Constitution defines the **non-negotiable laws** governing the Ticketing Platform.

It exists to ensure that the system remains:

- Deterministic  
- Auditable  
- Replay-safe  
- Legally and financially reconstructable  
- Resistant to silent corruption (human or AI)

If any code, test, or document conflicts with this Constitution, **the code is wrong**.

---

## 2. SCOPE & AUTHORITY

This Constitution governs:

- All capabilities  
- All phases  
- All contributors (human or AI)  
- All execution environments  

It supersedes:

- Implementation convenience  
- Performance considerations  
- Refactoring preferences  
- CI success signals  
- Stylistic or architectural taste  

---

## 3. FUNDAMENTAL EXECUTION INVARIANTS

These invariants are absolute.

### 3.1 Determinism

- All execution must be deterministic.  
- Identical inputs must produce identical outputs.  
- No randomness is permitted.  
- No hidden clocks are permitted.  
- All time must be explicitly injected.  
- All identifiers must be explicitly injected.  

### 3.2 No Hidden State

- No global mutable state.  
- No implicit environment-derived behavior.  
- All dependencies must be explicit in function signatures.  

---

## 4. CANONICAL MUTATING FUNCTION LAW

All state-mutating actions **must** follow the canonical mutating function template.

This is not a guideline. **It is a law.**

### 4.1 Mandatory Execution Order

Every mutating function must execute the following steps **in this exact order**:

1. Replay detection  
2. Authentication  
3. Authorization  
4. Validation  
5. State mutation  
6. Audit log entry (**exactly one**)  
7. Replay registry entry (**exactly one**)  
8. Return or throw  

Any deviation invalidates the function.

---

### 4.2 Replay Protection

- Replay detection must occur **before any mutation**.  
- Every attempted action produces **at most one** replay registry entry.  
- Replays must be rejected deterministically.  

---

### 4.3 Audit Guarantees

- Every attempted action produces **exactly one** audit log entry.  
- Audit logs are:  
  - Append-only  
  - Immutable  
  - Actor-attributed  

Silent behavior is forbidden.

---

## 5. SEPARATION OF CONCERNS (NON-NEGOTIABLE)

The following separations are absolute:

- Authorization ≠ Mutation  
- Mutation ≠ Verification  
- Verification **must never mutate state**  

No function may collapse these responsibilities.

---

## 6. FORBIDDEN IMPLEMENTATION PRACTICES

The following are explicitly forbidden in all mutating paths:

- `try/catch` blocks  
- Helper abstractions that obscure execution order  
- Reordered canonical steps  
- Altered import paths to bypass boundaries  
- Logging after throwing  
- “Cleanup” or “refactor” changes that alter structure  
- Array membership checks where `ReadonlySet.has()` is required  

These practices were historically attempted and rejected.

---

## 7. CAPABILITY SOVEREIGNTY

### 7.1 Capability 0 — Administrative Authority

Capability 0 is the **root of trust**.

It exclusively owns:

- Administrator identity  
- Authentication  
- Authorization  
- Role assignment  
- Audit logging  
- Replay protection  

Capability 0 must never:

- Access business data  
- Contain product logic  
- Depend on other capabilities  

Its structure, including the presence of a `src/` directory, is intentional and mandatory.

---

## 8. PHASE GOVERNANCE

The system evolves through a fixed phase model:

| Phase | Name                   | Purpose                               |
|------:|------------------------|----------------------------------------|
| 0     | Constitution           | Governance & invariants                |
| 1     | Capability Foundations | Build & freeze capabilities            |
| 2     | Capability Composition | Safe inter-capability interaction      |
| 3     | Product Domains        | Events, tickets, payments              |
| 4     | Scale & Operations     | Abuse, compliance, operations          |

No phase may be skipped.

---

## 9. FROZEN ARTIFACTS

Once frozen, the following may not be modified except for explicitly justified bug fixes:

- Capability logic  
- Public surfaces (`public.ts`)  
- Canonical tests  
- Canonical mutating template  

Frozen artifacts are treated as **law**, not code.

---

## 10. TESTS AS ENFORCEMENT

- Tests enforce constitutional rules.  
- Convention does not.  
- CI success does not override invariant violations.  
- If CI fails, **the design is wrong**, not the tests.  

---

## 11. AI GOVERNANCE PRINCIPLE

- AI-generated code is untrusted until audited.  
- AI must not infer missing interfaces or behavior.  
- AI must treat the repository as executable ground truth.  
- Architectural correctness outweighs velocity.  

---

## 12. AMENDMENTS

This Constitution may be amended **only** by:

- Explicit amendment entry  
- Clear rationale  
- Impact analysis  
- Forward-only change log  

See `AMENDMENTS_LOG.md`.

---

**End of Constitution**
