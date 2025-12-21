/* ============================================================
 * Capability 0 — In-Memory Store Implementations
 * ============================================================
 * These are reference implementations for governance state.
 * No business logic is permitted here.
 * ============================================================
 */

import {
  AdministratorIdentityStore,
  RoleAssignmentStore,
  AuditLogStore,
  ProcessedRequestRegistry,
} from "./stores";

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

export class InMemoryAdministratorIdentityStore
  implements AdministratorIdentityStore
{
  private readonly identities = new Map<string, AdministratorIdentity>();

  getById(adminId: string): AdministratorIdentity | undefined {
    return this.identities.get(adminId);
  }

  create(identity: AdministratorIdentity): void {
    if (this.identities.has(identity.adminId)) {
      throw new Error("Administrator already exists");
    }
    this.identities.set(identity.adminId, identity);
  }
}

/* -----------------------------
 * Role Assignment Store
 * -----------------------------
 */

export class InMemoryRoleAssignmentStore implements RoleAssignmentStore {
  private readonly assignments = new Map<string, Set<AdminRole>>();

  getRolesForAdmin(adminId: string): ReadonlySet<AdminRole> {
    return new Set(this.assignments.get(adminId) ?? []);
  }

  assign(roleAssignment: RoleAssignment): void {
    const roles =
      this.assignments.get(roleAssignment.adminId) ?? new Set<AdminRole>();
    roles.add(roleAssignment.role);
    this.assignments.set(roleAssignment.adminId, roles);
  }

  revoke(adminId: string, role: AdminRole): void {
    const roles = this.assignments.get(adminId);
    if (!roles) return;
    roles.delete(role);
    if (roles.size === 0) {
      this.assignments.delete(adminId);
    }
  }

  countAdminsWithRole(role: AdminRole): number {
    let count = 0;
    for (const roles of this.assignments.values()) {
      if (roles.has(role)) count++;
    }
    return count;
  }
}

/* -----------------------------
 * Audit Log Store
 * -----------------------------
 */

export class InMemoryAuditLogStore implements AuditLogStore {
  private readonly entries: AuditLogEntry[] = [];

  append(entry: AuditLogEntry): void {
    this.entries.push(entry);
  }

  readAll(): ReadonlyArray<AuditLogEntry> {
    return [...this.entries];
  }
}

/* -----------------------------
 * Processed Request Registry
 * -----------------------------
 */

export class InMemoryProcessedRequestRegistry
  implements ProcessedRequestRegistry
{
  private readonly processed = new Set<string>();

  has(requestId: string): boolean {
    return this.processed.has(requestId);
  }

  record(entry: ProcessedRequestEntry): void {
    this.processed.add(entry.requestId);
  }
}
