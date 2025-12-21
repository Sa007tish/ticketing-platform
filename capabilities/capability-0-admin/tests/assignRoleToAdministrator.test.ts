import { assignRoleToAdministrator } from "../src/assignRoleToAdministrator";
import { AdminRole } from "../src/types";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";

describe("assignRoleToAdministrator", () => {
  it("assigns a role and records a SUCCESS audit log", () => {
    const identityStore = new InMemoryAdministratorIdentityStore();
    const roleStore = new InMemoryRoleAssignmentStore();
    const auditLogStore = new InMemoryAuditLogStore();
    const requestRegistry = new InMemoryProcessedRequestRegistry();

    identityStore.create({
      adminId: "admin-1",
      email: "admin@test.com",
      createdAt: new Date(),
    });

    assignRoleToAdministrator({
      actorAdminId: "admin-1",
      targetAdminId: "admin-1",
      role: AdminRole.SUPER_ADMIN,
      requestId: "req-1",
      occurredAt: new Date(),
      identityStore,
      roleAssignmentStore: roleStore,
      auditLogStore,
      processedRequestRegistry: requestRegistry,
    });

    expect(roleStore.getRolesForAdmin("admin-1").has(AdminRole.SUPER_ADMIN)).toBe(
      true
    );

    const logs = auditLogStore.readAll();
    expect(logs).toHaveLength(1);
    expect(logs[0].outcome).toBe("SUCCESS");
  });

  it("records FAILURE when request is replayed", () => {
    const identityStore = new InMemoryAdministratorIdentityStore();
    const roleStore = new InMemoryRoleAssignmentStore();
    const auditLogStore = new InMemoryAuditLogStore();
    const requestRegistry = new InMemoryProcessedRequestRegistry();

    identityStore.create({
      adminId: "admin-1",
      email: "admin@test.com",
      createdAt: new Date(),
    });

    const input = {
      actorAdminId: "admin-1",
      targetAdminId: "admin-1",
      role: AdminRole.SUPER_ADMIN,
      requestId: "req-1",
      occurredAt: new Date(),
      identityStore,
      roleAssignmentStore: roleStore,
      auditLogStore,
      processedRequestRegistry: requestRegistry,
    };

    assignRoleToAdministrator(input);
    assignRoleToAdministrator(input);

    const logs = auditLogStore.readAll();
    expect(logs).toHaveLength(2);
    expect(logs[1].outcome).toBe("FAILURE");
  });
});
