import { assignRoleToAdministrator } from "../src/assignRoleToAdministrator";
import { AdminRole } from "../src/types";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { DeterministicIdGenerator } from "../src/idGenerator";

describe("assignRoleToAdministrator", () => {
  const now = new Date();

  test("assigns SUPPORT_ADMIN role successfully", () => {
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

    assignRoleToAdministrator(
      administratorStore,
      roleAssignmentStore,
      auditLogStore,
      processedRequestRegistry,
      idGenerator,
      "admin-1",
      "admin-1",
      AdminRole.SUPPORT_ADMIN,
      "initial assignment",
      "req-1",
      now
    );

    expect(
      roleAssignmentStore.getRolesForAdmin("admin-1").has(AdminRole.SUPPORT_ADMIN)
    ).toBe(true);

    const logs = auditLogStore.readAll();
    expect(logs).toHaveLength(1);
    expect(logs[0].outcome).toBe("SUCCESS");
  });
});
