# Core vs Perimeter Doctrine

**Status:** Authoritative  
**Scope:** System-wide  
**Audience:** Architects, Engineers, Governance AIs  
**Change Policy:** Amendable  
**Important:** This document is **non-exhaustive by design**

---

## 1. PURPOSE

This document defines the **classification rules** that distinguish
the **Core** of the system from the **Perimeter**.

It exists to:
- prevent over-governing flexible areas
- prevent under-governing critical areas
- guide future classification decisions

This document intentionally does **not** enumerate every component.

---

## 2. DEFINITIONS

### Core

The **Core** consists of anything that:
- creates irreversible facts
- mutates authoritative state
- affects money, tickets, inventory, or access rights
- produces audit or replay records
- must be legally and financially reconstructable

Core failures are catastrophic.

---

### Perimeter

The **Perimeter** consists of anything that:
- presents information
- collects intent
- assists decision-making
- may change rapidly
- is reversible by nature

Perimeter failures are recoverable.

---

## 3. CLASSIFICATION RULES

A component is **Core** if **any** of the following are true:
- it mutates state
- it finalizes an outcome
- it bypasses governance checks
- it creates audit-relevant events

A component is **Perimeter** if **all** of the following are true:
- it does not mutate core state
- it cannot finalize outcomes
- it can be replaced without affecting history

If classification is unclear → **treat as Core** until proven otherwise.

---

## 4. MIGRATION RULES

- Perimeter → Core: Allowed, with explicit documentation and review
- Core → Perimeter: Forbidden
- Core responsibilities must never be delegated outward

---

## 5. INTERACTION RULES

- Perimeter may request actions
- Core alone decides and records outcomes
- All Core mutations follow canonical mutating patterns

---

## 6. NON-GOALS

This document does NOT:
- list all Core components
- design UI or infrastructure
- define pricing algorithms
- freeze future architectural evolution

---

## 7. EVOLUTION

This doctrine evolves via amendment.
Silence or omission does not imply permission.

---

## Explicitly Unsupported Capabilities (Current)

The system explicitly does NOT support:

- Semi-trusted domains
- Local authority capabilities
- Delegated authority
- Horizontal scalability of trust

These constraints are intentional and binding.
Any future change requires explicit architectural amendment.


**End of Core vs Perimeter Doctrine**
