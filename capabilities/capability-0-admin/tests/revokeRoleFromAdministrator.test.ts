import { revokeRoleFromAdministrator } from "../src/revokeRoleFromAdministrator";
import { AdminRole } from "../src/types";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";

describe("revokeRoleFromAdministrator", () => {
  it("revokes a role and records SUCCESS", () => {
    const identityStore = new InMemoryAdministratorIdentityStore();
    const roleStore = new InMemoryRoleAssignmentStore();
    const auditLogStore = new InMemoryAuditLogStore();
    const requestRegistry = new InMemoryProcessedRequestRegistry();

    identityStore.create({
      adminId: "admin-1",
      email: "admin@test.com",
      createdAt: new Date(),
    });

    roleStore.assign({
      adminId: "admin-1",
      role: AdminRole.AUDIT_ADMIN,
      assignedAt: new Date(),
    });

    revokeRoleFromAdministrator({
      actorAdminId: "admin-1",
      targetAdminId: "admin-1",
      role: AdminRole.AUDIT_ADMIN,
      requestId: "req-1",
      occurredAt: new Date(),
      identityStore,
      roleAssignmentStore: roleStore,
      auditLogStore,
      processedRequestRegistry: requestRegistry,
    });

    expect(
      roleStore.getRolesForAdmin("admin-1").has(AdminRole.AUDIT_ADMIN)
    ).toBe(false);

    const logs = auditLogStore.readAll();
    expect(logs).toHaveLength(1);
    expect(logs[0].outcome).toBe("SUCCESS");
  });

  it("records FAILURE on replayed request", () => {
    const identityStore = new InMemoryAdministratorIdentityStore();
    const roleStore = new InMemoryRoleAssignmentStore();
    const auditLogStore = new InMemoryAuditLogStore();
    const requestRegistry = new InMemoryProcessedRequestRegistry();

    identityStore.create({
      adminId: "admin-1",
      email: "admin@test.com",
      createdAt: new Date(),
    });

    roleStore.assign({
      adminId: "admin-1",
      role: AdminRole.AUDIT_ADMIN,
      assignedAt: new Date(),
    });

    const input = {
      actorAdminId: "admin-1",
      targetAdminId: "admin-1",
      role: AdminRole.AUDIT_ADMIN,
      requestId: "req-1",
      occurredAt: new Date(),
      identityStore,
      roleAssignmentStore: roleStore,
      auditLogStore,
      processedRequestRegistry: requestRegistry,
    };

    revokeRoleFromAdministrator(input);
    revokeRoleFromAdministrator(input);

    const logs = auditLogStore.readAll();
    expect(logs).toHaveLength(2);
    expect(logs[1].outcome).toBe("FAILURE");
  });
});
