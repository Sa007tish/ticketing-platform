# Hard Lessons — Executed Failures & Permanent Safeguards

**Status:** Active (Append-only)  
**Audience:** Architects, Senior Engineers, Governance AIs  
**Purpose:** Prevent repetition of historically observed failure modes

---

## 1. REASONING BEFORE READING THE REPOSITORY

### What Happened

Design and reasoning occurred before enumerating the actual contents of the repository.

This led to:
- assumed interfaces
- invented exports
- incorrect mental models of capability boundaries

### Why This Was Dangerous

- Violated the repo-first rule
- Caused test and implementation drift
- Created false confidence based on reasoning rather than ground truth
- Broke the “code is the source of truth” principle

### Permanent Safeguard

**Repo-First Enumeration Rule** (Binding):

Before designing interfaces, proposing exports, or writing composition tests:
- the repository must be opened
- real exports must be enumerated
- reasoning must follow enumeration

Skipping this invalidates the output.

---

## 2. INVENTED EXPORTS IN PUBLIC SURFACES

### What Happened

Public surfaces (`public.ts`) were written assuming error names and exports that did not exist in implementation files.

### Why This Was Dangerous

- Broke cross-capability contracts
- Undermined trust in public surfaces
- Allowed silent architectural drift
- Created brittle composition logic

### Permanent Safeguard

- All public surfaces must be enumerated directly from real files
- No assumed exports are allowed
- Public surfaces are reviewed line-by-line against implementation
- Public surfaces are frozen once verified

---

## 3. ASSUMING ERROR AND TYPE NAMES

### What Happened

Error names and types were assumed based on convention rather than verified existence.

### Why This Was Dangerous

- Tests passed incorrect assumptions
- Errors surfaced late in integration
- Masked missing production validation

### Permanent Safeguard

- No error or type may be referenced unless verified in source
- Enumeration is mandatory
- Assumptions are treated as defects

---

## 4. LETTING CI DISCOVER REALITY

### What Happened

CI failures were used to “discover” missing interfaces or incorrect assumptions.

### Why This Was Dangerous

- CI became a discovery tool instead of a validator
- Design errors were deferred rather than prevented
- Feedback loops became expensive and noisy

### Permanent Safeguard

- CI validates decisions; it does not discover them
- Ground truth must be established before CI runs
- CI green is never treated as architectural proof

---

## 5. PHASE DOCUMENTATION LAGGING EXECUTION

### What Happened

Phase 2 composition work began before a formal Phase 1 closure artifact and Phase 2 documentation existed.

### Why This Was Dangerous

- Created contradictory narrative documents
- Confused phase status
- Increased onboarding risk for future maintainers

### Permanent Safeguard

- Phase execution must be accompanied by documentation
- Phase status must be explicitly recorded
- Known gaps must be documented, not ignored

---

## 6. OVER-RELIANCE ON AI OUTPUT

### What Happened

AI-generated code and reasoning were trusted too early.

### Why This Was Dangerous

- AI inferred intent instead of verifying reality
- Silent violations of invariants occurred
- Errors appeared “reasonable” but were incorrect

### Permanent Safeguard

- AI output is untrusted until audited
- AI must enumerate before reasoning
- Line-by-line review is mandatory for critical paths

---

## 7. GENERALIZED LESSON

Every failure above shared a common root cause:

> **Assuming intent is equivalent to reality.**

This system is intentionally rigid to prevent that assumption.

---

## 8. APPEND-ONLY POLICY

This document is append-only.

- Past entries must never be rewritten
- New lessons must be added as new sections
- History must not be sanitized

Institutional memory is a system asset.

---

**End of Hard Lessons**
