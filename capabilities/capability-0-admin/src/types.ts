/* ============================================================
 * Capability 0 — Foundational Types
 * ============================================================
 * No behavior.
 * No persistence.
 * No side effects.
 * ============================================================
 */

/* -----------------------------
 * Constitutional Role Enum
 * -----------------------------
 * Closed world. No extension allowed.
 */
export enum AdminRole {
  SUPPORT_ADMIN = "SUPPORT_ADMIN",
  OPERATIONS_ADMIN = "OPERATIONS_ADMIN",
  FINANCIAL_ADMIN = "FINANCIAL_ADMIN",
  LEGAL_COMPLIANCE_ADMIN = "LEGAL_COMPLIANCE_ADMIN",
  AUDIT_ADMIN = "AUDIT_ADMIN",
}

/* -----------------------------
 * Administrator Identity
 * -----------------------------
 * Identity ≠ authority.
 */
export interface AdministratorIdentity {
  readonly adminId: string;
  readonly createdAt: Date;
  readonly isAttendee: false;
  readonly isOrganiser: false;
  readonly status: "ACTIVE" | "DISABLED";
}

/* -----------------------------
 * Role Assignment (Current State)
 * -----------------------------
 */
export interface RoleAssignment {
  readonly adminId: string;
  readonly role: AdminRole;
  readonly assignedAt: Date;
  readonly assignedByAdminId: string;
}

/* -----------------------------
 * Audit Log Entry (Append-only)
 * -----------------------------
 */
export interface AuditLogEntry {
  readonly auditId: string;
  readonly timestamp: Date;
  readonly actorAdminId: string;
  readonly action:
    | "CREATE_ADMIN"
    | "ASSIGN_ROLE"
    | "REVOKE_ROLE"
    | "READ_AUDIT_LOG";
  readonly targetAdminId?: string;
  readonly justification: string;
  readonly outcome: "SUCCESS" | "FAILURE";
  readonly failureReason?: string;
  readonly requestId: string;
}

/* -----------------------------
 * Processed Request Entry
 * -----------------------------
 * Derivative, non-semantic.
 */
export interface ProcessedRequestEntry {
  readonly requestId: string;
  readonly processedAt: Date;
}
