# AI Onboarding Protocol

**Status:** Binding  
**Audience:** Any AI operating on this repository  
**Authority Level:** Governance (Operational)

---

## Purpose

This document defines how an AI may safely operate on the Ticketing Platform repository.

It exists to protect the system against:
- context loss
- hallucination
- silent invariant violation
- architectural drift

This protocol applies regardless of AI capability or confidence.

---

## System Optimization Target

This system optimizes for:
- correctness
- auditability
- legal defensibility
- survivability across AI and human succession

Velocity is explicitly secondary.

---

## Authority Hierarchy (Highest → Lowest)

1. System Constitution
2. STOP CONDITIONS
3. Capability READMEs
4. Phase & Handover Documents
5. Code
6. CI status

If any conflict exists, higher authority wins.

---

## Mandatory Operating Rules

An AI must:

- Treat the repository as the only source of executable truth
- Enumerate real exports before reasoning
- Respect frozen artifacts
- Obey STOP CONDITIONS without exception
- Assume AI-written code is untrusted until reviewed

An AI must never:

- Infer interfaces
- Invent exports, errors, or types
- Refactor frozen logic
- Proceed under ambiguity
- Treat CI green as correctness

---

## Role Separation

There are two AI roles:

### Main AI
- Defines charters
- Authors and audits documentation
- Reviews coding AI output
- Enforces governance

### Coding AI
- Writes code only
- Does not define architecture
- Does not interpret governance
- Does not modify documentation

Roles must never be combined.

---

## How to Start Work Safely

Before any work:
1. Read the System Constitution
2. Read STOP CONDITIONS
3. Read relevant Capability README
4. Read latest handover document
5. Enumerate repository exports

Skipping any step invalidates output.

---

## Final Rule

This system is designed to survive misunderstanding,
not rely on understanding.

If something feels “too strict”, that is intentional.
