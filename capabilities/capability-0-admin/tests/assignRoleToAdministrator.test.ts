import { assignRoleToAdministrator } from "../src/assignRoleToAdministrator";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { AdminRole } from "../src/types";

const fixedNow = new Date("2025-01-01T00:00:00Z");

describe("assignRoleToAdministrator", () => {
  it("assigns a role when invoked by an authorized admin", () => {
    const administratorStore = new InMemoryAdministratorIdentityStore();
    const roleStore = new InMemoryRoleAssignmentStore();
    const auditLogStore = new InMemoryAuditLogStore();
    const processedRegistry = new InMemoryProcessedRequestRegistry();

    const idGenerator = { nextId: () => "audit-1" };

    administratorStore.create({
      adminId: "actor-admin",
      createdAt: fixedNow,
    });

    administratorStore.create({
      adminId: "target-admin",
      createdAt: fixedNow,
    });

    roleStore.assign({
      adminId: "actor-admin",
      role: AdminRole.SUPPORT_ADMIN,
      assignedAt: fixedNow,
      assignedByAdminId: "actor-admin",
    });

    assignRoleToAdministrator(
      administratorStore,
      roleStore,
      auditLogStore,
      processedRegistry,
      idGenerator,
      "actor-admin",
      "target-admin",
      AdminRole.SUPPORT_ADMIN,
      "Operational requirement",
      "req-1",
      fixedNow
    );

    expect(
      roleStore.getRolesForAdmin("target-admin").has(AdminRole.SUPPORT_ADMIN)
    ).toBe(true);

    const logs = auditLogStore.readAll();
    expect(logs).toHaveLength(1);
    expect(logs[0].outcome).toBe("SUCCESS");
  });
});
