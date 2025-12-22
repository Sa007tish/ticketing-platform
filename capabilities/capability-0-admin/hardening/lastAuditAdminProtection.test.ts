import { revokeRoleFromAdministrator } from "../src/revokeRoleFromAdministrator";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { AdminRole, AdministratorStatus } from "../src/types";
import { LastAuditAdminRemovalError } from "../src/errors";

describe("Hardening: Last AUDIT_ADMIN protection", () => {
  it("prevents removing the final AUDIT_ADMIN", () => {
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
      revokeRoleFromAdministrator(
        {
          requestId: "revoke-1",
          actorAdminId: "actor",
          targetAdminId: "actor",
          role: AdminRole.AUDIT_ADMIN,
          justification: "test",
          occurredAt: now,
        },
        adminStore,
        roleStore,
        auditLog,
        registry
      )
    ).toThrow(LastAuditAdminRemovalError);
  });
});
