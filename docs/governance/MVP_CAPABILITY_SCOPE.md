# MVP Capability Scope

**Status:** Approved (Scope Definition)  
**Authority Level:** Governance (Non-Constitutional)  
**Derived From:** System Constitution v1.0  
**Change Policy:** Explicit revision with rationale  
**Execution Authority:** None (Charter Required)

---

## 1. PURPOSE

This document defines the **approved capability scope** for the MVP.

It specifies:
- which capabilities are **permitted to exist** within the MVP,
- the **mandatory dependency order** between them,
- and their **relative risk classification**.

This document exists to prevent:
- scope creep,
- unauthorized capability introduction,
- and premature or unsafe execution.

This document **authorizes scope only**.

It does **not**:
- grant permission to implement any capability,
- replace Capability Charters,
- override the System Constitution,
- or authorize deviation from the phase model.

No capability may be implemented solely because it appears in this document.
Each capability requires an explicit **Phase 1A Capability Charter** and approval.

---

## 2. SCOPE BOUNDARY (MVP)

The following capabilities constitute the **entire approved scope** of the MVP.

Any capability not listed here is **out of scope** unless this document is explicitly revised.

---

## 3. FINAL MVP CAPABILITY LIST

### Foundation

0. **System Administration & Role Management**  
1. **User Registration & Authentication**  
2. **Consent Capture & Withdrawal**

---

### Supply Side

3. **Event Creation & Publishing**  
4. **Ticket Type & Inventory Management**

---

### Demand Side

5. **Event Discovery & Details**  
6. **Ticket Reservation**  
7. **Order Creation**

---

### Payments

8. **Platform Fee Calculation**  
9. **Payment Initiation & Confirmation**  
10. **Ticket Issuance & Delivery**

---

### Operations

11. **Offline Ticket Validation**  
12. **Ticket Usage & Override Logging**

---

### Financial Resolution

13. **Refund Handling**  
14. **Organiser Payout Preparation**  
15. **Administrative Audit & Logs**

---

## 4. DEPENDENCY ORDER (MANDATORY)

Capabilities must be implemented in the following order:

0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15


This order reflects:
- governance dependencies,
- data dependencies,
- and irreversibility constraints.

Skipping, reordering, or parallelizing capabilities across this boundary
is a **governance violation** unless explicitly approved.

---

## 5. RISK CLASSIFICATION

Risk classification reflects:
- financial exposure,
- legal exposure,
- operational blast radius,
- and irreversibility.

### Very High Risk

- System Administration & Role Management  
- Platform Fee Calculation  
- Payment Initiation & Confirmation  
- Ticket Issuance & Delivery  
- Offline Ticket Validation  
- Refund Handling  

---

### High Risk

- Consent Capture  
- Ticket Inventory Management  
- Ticket Reservation  
- Order Creation  
- Ticket Usage & Overrides  
- Organiser Payout Preparation  
- Administrative Audit & Logs  

---

### Medium / Low Risk

- User Registration  
- Event Creation  
- Event Discovery  

Risk classification informs:
- test rigor,
- review depth,
- and hardening expectations.

---

## 6. GOVERNANCE CONSTRAINTS

- Inclusion in this list **does not authorize execution**.
- Execution requires:
  - an approved Phase 1A Capability Charter,
  - canonical Phase 1B test specifications,
  - and successful Phase 1C/1D completion.
- Capabilities may not be partially implemented.
- Capabilities may not be merged, split, or skipped without revising this document.

---

## 7. CHANGE MANAGEMENT

Changes to this document require:
- explicit rationale,
- impact analysis,
- and forward-only revision history.

This document may evolve,
but only through **deliberate governance action**.

## Deferred but Mandatory Capabilities

The following capabilities are intentionally excluded from the MVP.
Their absence is deliberate and scoped, not accidental.

Any future work that introduces payments, refunds, disputes, multi-actor workflows,
or cross-domain state coordination MUST revisit this section before implementation.

### 1. Composition / Policy Authority
- Status: Deferred
- Rationale:
  The MVP does not yet include sufficient cross-domain interactions to justify a
  dedicated composition authority.
- Responsibility (when introduced):
  - Own cross-capability invariants
  - Define precedence rules between capabilities
  - Define forbidden compositions
- Risk if ignored:
  Cross-capability logic will drift into domain capabilities, eroding authority
  boundaries and auditability.

### 2. Ledger / Event Authority
- Status: Deferred
- Rationale:
  The MVP explicitly excludes payments, refunds, chargebacks, and reconciliation.
- Responsibility (when introduced):
  - Domain-independent event recording
  - Financial state reconstruction
  - Temporal ordering guarantees
- Risk if ignored:
  Financial state becomes non-replayable and legally indefensible.

### 3. Delegated Authority
- Status: Deferred (Conditional)
- Rationale:
  The MVP operates under a single sovereign authority model.
- Responsibility (when introduced):
  - Grant scoped, revocable authority
  - Enforce bounded mutation rights
- Risk if ignored:
  Introducing roles (vendors, operators, refund agents) will require architectural
  rewrites rather than extensions.


---

**End of MVP Capability Scope**
