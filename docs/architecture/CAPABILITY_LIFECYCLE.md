# Capability Lifecycle

This document defines the formal lifecycle of a capability.
Lifecycle transitions are governance actions and must not be enforced socially.

## Lifecycle States

### 1. Draft
- Public surface unstable
- Tests incomplete
- MUST NOT be imported by other capabilities

### 2. Verified
- Canonical mutator template enforced
- Deterministic execution proven
- Replay protection tested
- Audit logging tested
- Negative tests exist
- Public surface explicitly enumerated

### 3. Frozen
- Public surface immutable
- Behavior immutable
- Only strictly justified bug fixes allowed
- No new exports permitted

### 4. Deprecated
- Capability remains present
- No new dependencies permitted
- Replacement capability must be documented
- Existing compositions remain valid

## Prohibited Transitions
- Frozen → Verified
- Frozen → Draft
- Deprecated → Active
