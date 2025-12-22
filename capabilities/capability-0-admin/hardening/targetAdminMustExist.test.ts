import { assignRoleToAdministrator } from "../src/assignRoleToAdministrator";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { AdminRole, AdministratorStatus } from "../src/types";
import { AdministratorNotFoundError } from "../src/errors";

describe("Hardening: Target admin must exist", () => {
  it("rejects assignment to non-existent admin", () => {
    const now = new Date();

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

    roleStore.assign({
      adminId: "actor",
      role: AdminRole.AUDIT_ADMIN,
      assignedByAdminId: "system",
      assignedAt: now,
    });

    expect(() =>
      assignRoleToAdministrator(
        {
          requestId: "req-missing",
          actorAdminId: "actor",
          targetAdminId: "ghost",
          role: AdminRole.SUPPORT_ADMIN,
          justification: "test",
          occurredAt: now,
        },
        adminStore,
        roleStore,
        auditLog,
        registry
      )
    ).toThrow(AdministratorNotFoundError);
  });
});
