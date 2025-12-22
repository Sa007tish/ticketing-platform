import { revokeRoleFromAdministrator } from "../src/revokeRoleFromAdministrator";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { AdminRole } from "../src/types";
import { DeterministicIdGenerator } from "../src/idGenerator";

test("cannot revoke last remaining AUDIT_ADMIN", () => {
  const now = new Date();

  const adminStore = new InMemoryAdministratorIdentityStore();
  const roleStore = new InMemoryRoleAssignmentStore();
  const auditLog = new InMemoryAuditLogStore();
  const registry = new InMemoryProcessedRequestRegistry();
  const idGen = new DeterministicIdGenerator();

  adminStore.create({
    adminId: "only-admin",
    createdAt: now,
    isAttendee: false,
    isOrganiser: false,
    status: "ACTIVE",
  });

  roleStore.assign({
    adminId: "only-admin",
    role: AdminRole.AUDIT_ADMIN,
    assignedAt: now,
    assignedByAdminId: "system",
  });

  expect(() =>
    revokeRoleFromAdministrator(
      adminStore,
      roleStore,
      auditLog,
      registry,
      idGen,
      "only-admin",
      "only-admin",
      AdminRole.AUDIT_ADMIN,
      "attempt removal",
      "req-3",
      now
    )
  ).toThrow();

  expect(roleStore.getRolesForAdmin("only-admin").has(AdminRole.AUDIT_ADMIN)).toBe(
    true
  );
});
