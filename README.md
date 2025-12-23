# Ticketing Platform — MVP

This repository contains the MVP implementation of a ticketing platform,
built using a governance-first, capability-driven architecture.

## Important Rules

- Code is developed capability by capability.
- Each capability has:
  - a formal contract
  - explicit invariants
  - isolated implementation
- Capability 0 (System Administration & Role Management) is governance-critical
  and will be locked after completion.

## Development Discipline

- TypeScript only
- No frameworks until explicitly approved
- No local-only code
- All changes must respect the System Constitution

This repository is the single source of truth.

## How to Read This Repository (Mandatory)

This README is an **orientation document**, not a specification.

Before making changes, designing new capabilities, or reasoning about
architecture, you **must** read the authoritative documents listed below.

### Authority Hierarchy (Highest → Lowest)

1. **System Constitution**  
   `docs/governance/SYSTEM_CONSTITUTION.md`  
   Immutable governance rules and global invariants.

2. **Operational Governance (STOP CONDITIONS & AI Onboarding)**  
   - `docs/governance/STOP_CONDITIONS.md`  
   - `docs/handover/AI_ONBOARDING_PROTOCOL.md`  
   Defines mandatory halting conditions and AI operating rules.

3. **Architectural Control Plane**
   - `docs/architecture/ARCHITECTURAL_DECISION_INDEX.md`
   - `docs/architecture/CORE_VS_PERIMETER.md`
   - `docs/architecture/DEFERRED_BUT_MANDATORY.md`
   Defines irreversible decisions, classification rules, and deferred obligations.

4. **Capability READMEs**  
   Located inside each capability directory.  
   Define purpose, powers, invariants, and frozen surfaces.

5. **Phase & Handover Documents**  
   Located in `docs/architecture/` and `docs/handover/`.  
   Capture executed reality and authorized next steps.

6. **This README**  
   Entry point and navigation aid only.

If any document or code conflicts with the System Constitution,
the **code is wrong**.

### For New Contributors (Human or AI)

- Do **not** start by writing code.
- Do **not** infer interfaces or behavior.
- Do **not** rely on CI green as proof of correctness.

Start by reading:
- `docs/governance/SYSTEM_CONSTITUTION.md`
- the relevant capability README
- the latest handover document

This repository is intentionally strict.
Rigidity is a feature, not a bug.
