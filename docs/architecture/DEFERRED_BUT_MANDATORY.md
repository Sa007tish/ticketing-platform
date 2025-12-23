# Deferred-but-Mandatory Decisions

**Status:** Authoritative  
**Scope:** System-wide  
**Audience:** Architects, Product Owners, Governance AIs  
**Change Policy:** Append-only

---

## 1. PURPOSE

This document records **decisions that are intentionally deferred**
but **must be addressed in the future**.

Deferral does not imply optionality.

This document exists to prevent:
- institutional amnesia
- accidental permanent deferral
- premature or unsafe implementation

---

## 2. DEFERRED ITEMS

### DMD-001 — Ticket Resale Market

**Deferred Because:**  
High legal, fraud, and consumer-protection risk.

**Mandatory Because:**  
Market demand may require controlled resale.

**Trigger to Revisit:**  
- regulatory clarity
- sufficient platform scale
- anti-scalping infrastructure readiness

**Risk if Ignored:**  
Loss of market relevance or uncontrolled external resale.

---

### DMD-002 — Anti-Scalping Systems

**Deferred Because:**  
Requires data, behavioral patterns, and scale.

**Mandatory Because:**  
Platform trust and fairness depend on it.

**Trigger to Revisit:**  
- evidence of abuse
- resale or secondary-market introduction

**Risk if Ignored:**  
Reputational damage and regulatory scrutiny.

---

### DMD-003 — Dynamic Pricing Algorithms

**Deferred Because:**  
High complexity, low signal pre-PMF.

**Mandatory Because:**  
Revenue optimization and organizer flexibility.

**Trigger to Revisit:**  
- sufficient sales data
- organizer demand

**Risk if Ignored:**  
Economic rigidity and competitive disadvantage.

---

### DMD-004 — Adjustable Platform Fee Tiers

**Deferred Because:**  
UI and policy tooling not yet introduced.

**Mandatory Because:**  
Business model evolution requires flexibility.

**Trigger to Revisit:**  
- UI introduction
- multi-organizer onboarding

**Risk if Ignored:**  
Hardcoded economics and slow iteration.

---

### DMD-005 — Seat Maps & Structured Inventory

**Deferred Because:**  
Inventory complexity exceeds MVP needs.

**Mandatory Because:**  
Certain venues require seat-level control.

**Trigger to Revisit:**  
- venue requirements
- organizer demand

**Risk if Ignored:**  
Inability to serve major event categories.

---

### DMD-006 — Jurisdiction-Specific Compliance

**Deferred Because:**  
MVP operates under limited jurisdiction.

**Mandatory Because:**  
Expansion requires compliance.

**Trigger to Revisit:**  
- new markets
- regulatory changes

**Risk if Ignored:**  
Legal exposure and forced shutdowns.

---

## 3. GOVERNANCE RULE

Deferred items must:
- be revisited intentionally
- never be implemented ad hoc
- be removed only by explicit decision

---

**End of Deferred-but-Mandatory Decisions**
