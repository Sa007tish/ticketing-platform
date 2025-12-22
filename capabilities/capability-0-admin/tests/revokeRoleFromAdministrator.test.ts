import { revokeRoleFromAdministrator } from "../src/revokeRoleFromAdministrator";
import { AdminRole } from "../src/types";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { DeterministicIdGenerator } from "../src/idGenerator";
import {
  UnauthenticatedAdminError,
  TargetAdminNotFoundError,
  MissingJustificationError,
  InvalidRoleError,
  UnauthorizedRoleAssignmentError,
  ReplayRequestDetectedError,
  LastAuditAdminRemovalError,
} from "../src/errors";

describe("revokeRoleFromAdministrator", () => {
  const fixedNow = new Date("2025-01-01T00:00:00.000Z");

  let administratorStore: InMemoryAdministratorIdentityStore;
  let roleStore: InMemoryRoleAssignmentStore;
  let auditLogStore: InMemoryAuditLogStore;
  let processedRequestRegistry: InMemoryProcessedRequestRegistry;
  let idGenerator: DeterministicIdGenerator;

  beforeEach(() => {
    administratorStore = new InMemoryAdministratorIdentityStore();
    roleStore = new InMemoryRoleAssignmentStore();
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
  });

  test("successfully revokes role", () => {
    roleStore.assign({
      adminId: "actor-admin",
      role: AdminRole.SUPPORT_ADMIN,
      assignedAt: fixedNow,
      assignedByAdminId: "system",
    });

    roleStore.assign({
      adminId: "target-admin",
      role: AdminRole.SUPPORT_ADMIN,
      assignedAt: fixedNow,
      assignedByAdminId: "system",
    });

    revokeRoleFromAdministrator(
      administratorStore,
      roleStore,
      auditLogStore,
      processedRequestRegistry,
      idGenerator,
      "actor-admin",
      "target-admin",
      AdminRole.SUPPORT_ADMIN,
      "revoke support role",
      "req-1",
      fixedNow
    );

    expect(roleStore.getRolesForAdmin("target-admin").has(AdminRole.SUPPORT_ADMIN)).toBe(
      false
    );
    expect(auditLogStore.readAll()).toHaveLength(1);
  });

  test("prevents revoking last AUDIT_ADMIN", () => {
    roleStore.assign({
      adminId: "target-admin",
      role: AdminRole.AUDIT_ADMIN,
      assignedAt: fixedNow,
      assignedByAdminId: "system",
    });

    expect(() =>
      revokeRoleFromAdministrator(
        administratorStore,
        roleStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "target-admin",
        "target-admin",
        AdminRole.AUDIT_ADMIN,
        "attempt last audit admin removal",
        "req-2",
        fixedNow
      )
    ).toThrow(LastAuditAdminRemovalError);
  });

  test("rejects replay request", () => {
    processedRequestRegistry.record({ requestId: "req-3", processedAt: fixedNow });

    expect(() =>
      revokeRoleFromAdministrator(
        administratorStore,
        roleStore,
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

  test("fails for unauthenticated actor", () => {
    expect(() =>
      revokeRoleFromAdministrator(
        administratorStore,
        roleStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "unknown-admin",
        "target-admin",
        AdminRole.SUPPORT_ADMIN,
        "revoke support role",
        "req-4",
        fixedNow
      )
    ).toThrow(UnauthenticatedAdminError);
  });

  test("fails when target admin does not exist", () => {
    expect(() =>
      revokeRoleFromAdministrator(
        administratorStore,
        roleStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "missing-admin",
        AdminRole.SUPPORT_ADMIN,
        "revoke support role",
        "req-5",
        fixedNow
      )
    ).toThrow(TargetAdminNotFoundError);
  });

  test("fails when justification is missing", () => {
    expect(() =>
      revokeRoleFromAdministrator(
        administratorStore,
        roleStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "target-admin",
        AdminRole.SUPPORT_ADMIN,
        "",
        "req-6",
        fixedNow
      )
    ).toThrow(MissingJustificationError);
  });

  test("fails for invalid role", () => {
    expect(() =>
      revokeRoleFromAdministrator(
        administratorStore,
        roleStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "target-admin",
        "INVALID_ROLE" as AdminRole,
        "revoke invalid role",
        "req-7",
        fixedNow
      )
    ).toThrow(InvalidRoleError);
  });
});
