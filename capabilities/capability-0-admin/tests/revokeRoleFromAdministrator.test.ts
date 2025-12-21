import { revokeRoleFromAdministrator } from "../src/revokeRoleFromAdministrator";
import { AdminRole } from "../src/types";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { DeterministicIdGenerator } from "../src/idGenerator";

describe("revokeRoleFromAdministrator", () => {
  const now = new Date();

  test("revokes AUDIT_ADMIN role successfully", () => {
    const administratorStore = new InMemoryAdministratorIdentityStore();
    const roleAssignmentStore = new InMemoryRoleAssignmentStore();
    const auditLogStore = new InMemoryAuditLogStore();
    const processedRequestRegistry = new InMemoryProcessedRequestRegistry();
    const idGenerator = new DeterministicIdGenerator();

    administratorStore.create({
      adminId: "admin-1",
      createdAt: now,
      isAttendee: false,
      isOrganiser: false,
      status: "ACTIVE",
    });

    roleAssignmentStore.assign({
      adminId: "admin-1",
      role: AdminRole.AUDIT_ADMIN,
      assignedAt: now,
      assignedByAdminId: "system",
    });

    revokeRoleFromAdministrator(
      administratorStore,
      roleAssignmentStore,
      auditLogStore,
      processedRequestRegistry,
      idGenerator,
      "admin-1",
      "admin-1",
      AdminRole.AUDIT_ADMIN,
      "cleanup",
      "req-1",
      now
    );

    expect(
      roleAssignmentStore.getRolesForAdmin("admin-1").has(AdminRole.AUDIT_ADMIN)
    ).toBe(false);

    const logs = auditLogStore.readAll();
    expect(logs).toHaveLength(1);
    expect(logs[0].outcome).toBe("SUCCESS");
  });
});
