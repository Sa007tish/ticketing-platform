import { revokeRoleFromAdministrator } from "../src/revokeRoleFromAdministrator";
import { assignRoleToAdministrator } from "../src/assignRoleToAdministrator";
import { AdminRole } from "../src/types";
import {
  ReplayRequestDetectedError,
  LastAuditAdminRemovalError,
} from "../src/errors";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { DeterministicIdGenerator } from "../src/idGenerator";

describe("revokeRoleFromAdministrator", () => {
  const fixedNow = new Date("2025-01-01T00:00:00.000Z");

  let administratorStore: InMemoryAdministratorIdentityStore;
  let roleAssignmentStore: InMemoryRoleAssignmentStore;
  let auditLogStore: InMemoryAuditLogStore;
  let processedRequestRegistry: InMemoryProcessedRequestRegistry;
  let idGenerator: DeterministicIdGenerator;

  beforeEach(() => {
    administratorStore = new InMemoryAdministratorIdentityStore();
    roleAssignmentStore = new InMemoryRoleAssignmentStore();
    auditLogStore = new InMemoryAuditLogStore();
    processedRequestRegistry = new InMemoryProcessedRequestRegistry();
    idGenerator = new DeterministicIdGenerator();

    administratorStore.create({
      adminId: "actor-admin",
      createdAt: fixedNow,
      isAttendee: false,
      isOrganiser: false,
      status: "ACTIVE",
    });

    administratorStore.create({
      adminId: "target-admin",
      createdAt: fixedNow,
      isAttendee: false,
      isOrganiser: false,
      status: "ACTIVE",
    });

    // Bootstrap authority correctly
    assignRoleToAdministrator(
      administratorStore,
      roleAssignmentStore,
      auditLogStore,
      processedRequestRegistry,
      idGenerator,
      "actor-admin",
      "actor-admin",
      AdminRole.AUDIT_ADMIN,
      "bootstrap audit role",
      "bootstrap-1",
      fixedNow
    );
  });

  test("successfully revokes role", () => {
    assignRoleToAdministrator(
      administratorStore,
      roleAssignmentStore,
      auditLogStore,
      processedRequestRegistry,
      idGenerator,
      "actor-admin",
      "target-admin",
      AdminRole.SUPPORT_ADMIN,
      "grant support role",
      "req-1",
      fixedNow
    );

    revokeRoleFromAdministrator(
      administratorStore,
      roleAssignmentStore,
      auditLogStore,
      processedRequestRegistry,
      idGenerator,
      "actor-admin",
      "target-admin",
      AdminRole.SUPPORT_ADMIN,
      "revoke support role",
      "req-2",
      fixedNow
    );

    expect(
      roleAssignmentStore.getRolesForAdmin("target-admin").has(AdminRole.SUPPORT_ADMIN)
    ).toBe(false);

    const logs = auditLogStore.getAll();
    expect(logs.at(-1)?.outcome).toBe("SUCCESS");
  });

  test("rejects replay request", () => {
    processedRequestRegistry.record({ requestId: "req-3", processedAt: fixedNow });

    expect(() =>
      revokeRoleFromAdministrator(
        administratorStore,
        roleAssignmentStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "target-admin",
        AdminRole.SUPPORT_ADMIN,
        "revoke support role",
        "req-3",
        fixedNow
      )
    ).toThrow(ReplayRequestDetectedError);
  });

  test("fails when attempting to revoke last AUDIT_ADMIN", () => {
    expect(() =>
      revokeRoleFromAdministrator(
        administratorStore,
        roleAssignmentStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "actor-admin",
        AdminRole.AUDIT_ADMIN,
        "attempt last audit admin removal",
        "req-4",
        fixedNow
      )
    ).toThrow(LastAuditAdminRemovalError);

    expect(
      roleAssignmentStore.getRolesForAdmin("actor-admin").has(AdminRole.AUDIT_ADMIN)
    ).toBe(true);
  });
});
