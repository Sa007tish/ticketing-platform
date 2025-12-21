/* ============================================================
 * Capability 0 — Persistence Interfaces
 * ============================================================
 * These interfaces define the ONLY permitted state access.
 * Implementations must respect immutability and append-only rules.
 * ============================================================
 */

import {
  AdministratorIdentity,
  RoleAssignment,
  AuditLogEntry,
  ProcessedRequestEntry,
  AdminRole,
} from "./types";

/* -----------------------------
 * Administrator Identity Store
 * -----------------------------
 */

export interface AdministratorIdentityStore {
  getById(adminId: string): AdministratorIdentity | undefined;
  create(identity: AdministratorIdentity): void;
}

/* -----------------------------
 * Role Assignment Store
 * -----------------------------
 * Represents CURRENT state only.
 */

export interface RoleAssignmentStore {
  getRolesForAdmin(adminId: string): ReadonlySet<AdminRole>;
  assign(role: RoleAssignment): void;
  revoke(adminId: string, role: AdminRole): void;
  countAdminsWithRole(role: AdminRole): number;
}

/* -----------------------------
 * Audit Log Store
 * -----------------------------
 * Append-only, immutable history.
 */

export interface AuditLogStore {
  append(entry: AuditLogEntry): void;
  readAll(): ReadonlyArray<AuditLogEntry>;
}

/* -----------------------------
 * Processed Request Registry
 * -----------------------------
 * Derivative replay protection only.
 */

export interface ProcessedRequestRegistry {
  has(requestId: string): boolean;
  record(entry: ProcessedRequestEntry): void;
}
