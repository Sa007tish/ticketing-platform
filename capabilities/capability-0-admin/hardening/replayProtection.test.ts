import { assignRoleToAdministrator } from "../src/assignRoleToAdministrator";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { AdminRole, AdministratorStatus } from "../src/types";
import { DuplicateRequestError } from "../src/errors";

describe("Hardening: Replay protection", () => {
  it("rejects duplicate requestId", () => {
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

    const input = {
      requestId: "dup-req",
      actorAdminId: "actor",
      targetAdminId: "target",
      role: AdminRole.SUPPORT_ADMIN,
      justification: "test",
      occurredAt: now,
    };

    assignRoleToAdministrator(input, adminStore, roleStore, auditLog, registry);

    expect(() =>
      assignRoleToAdministrator(input, adminStore, roleStore, auditLog, registry)
    ).toThrow(DuplicateRequestError);
  });
});
