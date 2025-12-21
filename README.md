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
