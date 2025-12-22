import { assignRoleToAdministrator } from "../src/assignRoleToAdministrator";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { AdminRole, AdministratorStatus } from "../src/types";
import { UnauthorizedRoleAssignmentError } from "../src/errors";

describe("Hardening: Unauthorized role assignment", () => {
  it("rejects role assignment by an admin without sufficient authority", () => {
    const now = new Date("2025-01-01T00:00:00Z");

    const adminStore = new InMemoryAdministratorIdentityStore();
    const roleStore = new InMemoryRoleAssignmentStore();
    const auditLog = new InMemoryAuditLogStore();
    const registry = new InMemoryProcessedRequestRegistry();

    adminStore.create({
      adminId: "actor",
      createdAt: now,
      status: AdministratorStatus.ACTIVE,
      isAttendee: false,
      isOrganiser: false,
    });

    adminStore.create({
      adminId: "target",
      createdAt: now,
      status: AdministratorStatus.ACTIVE,
      isAttendee: false,
      isOrganiser: false,
    });

    expect(() =>
      assignRoleToAdministrator(
        {
          requestId: "req-1",
          actorAdminId: "actor",
          targetAdminId: "target",
          role: AdminRole.SUPPORT_ADMIN,
          justification: "test",
          occurredAt: now,
        },
        adminStore,
        roleStore,
        auditLog,
        registry
      )
    ).toThrow(UnauthorizedRoleAssignmentError);
  });
});
