import { assignRoleToAdministrator } from "../src/assignRoleToAdministrator";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { AdminRole, AdministratorStatus } from "../src/types";
import { MissingJustificationError } from "../src/errors";

describe("Hardening: Missing justification", () => {
  it("rejects empty justification", () => {
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

    adminStore.create({
      adminId: "target",
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
          requestId: "req-x",
          actorAdminId: "actor",
          targetAdminId: "target",
          role: AdminRole.SUPPORT_ADMIN,
          justification: "",
          occurredAt: now,
        },
        adminStore,
        roleStore,
        auditLog,
        registry
      )
    ).toThrow(MissingJustificationError);
  });
});
