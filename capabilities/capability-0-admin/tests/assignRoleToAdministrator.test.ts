import { assignRoleToAdministrator } from "../src/assignRoleToAdministrator";
import { AdminRole } from "../src/types";
import {
  UnauthenticatedAdminError,
  TargetAdminNotFoundError,
  MissingJustificationError,
  InvalidRoleError,
  UnauthorizedRoleAssignmentError,
  ReplayRequestDetectedError,
} from "../src/errors";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { DeterministicIdGenerator } from "../src/idGenerator";

describe("assignRoleToAdministrator", () => {
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
  });

  test("successfully assigns role", () => {
    roleAssignmentStore.assignRole({
      adminId: "actor-admin",
      role: AdminRole.SUPPORT_ADMIN,
      assignedAt: fixedNow,
      assignedByAdminId: "system",
    });

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

    expect(
      roleAssignmentStore
        .getRolesForAdmin("target-admin")
        .has(AdminRole.SUPPORT_ADMIN)
    ).toBe(true);
    expect(auditLogStore.entries).toHaveLength(1);
    expect(auditLogStore.entries[0].outcome).toBe("SUCCESS");
    expect(processedRequestRegistry.has("req-1")).toBe(true);
  });

  test("rejects replay request", () => {
    processedRequestRegistry.record({ requestId: "req-1", processedAt: fixedNow });

    expect(() =>
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
      )
    ).toThrow(ReplayRequestDetectedError);

    expect(auditLogStore.entries).toHaveLength(1);
    expect(auditLogStore.entries[0].outcome).toBe("FAILURE");
    expect(processedRequestRegistry.has("req-1")).toBe(true);
  });

  test("fails for unauthenticated actor", () => {
    expect(() =>
      assignRoleToAdministrator(
        administratorStore,
        roleAssignmentStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "unknown-admin",
        "target-admin",
        AdminRole.SUPPORT_ADMIN,
        "grant support role",
        "req-2",
        fixedNow
      )
    ).toThrow(UnauthenticatedAdminError);

    expect(auditLogStore.entries).toHaveLength(1);
    expect(processedRequestRegistry.has("req-2")).toBe(true);
  });

  test("fails when target admin not found", () => {
    expect(() =>
      assignRoleToAdministrator(
        administratorStore,
        roleAssignmentStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "missing-admin",
        AdminRole.SUPPORT_ADMIN,
        "grant support role",
        "req-3",
        fixedNow
      )
    ).toThrow(TargetAdminNotFoundError);

    expect(auditLogStore.entries).toHaveLength(1);
  });

  test("fails when justification is missing", () => {
    expect(() =>
      assignRoleToAdministrator(
        administratorStore,
        roleAssignmentStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "target-admin",
        AdminRole.SUPPORT_ADMIN,
        "",
        "req-4",
        fixedNow
      )
    ).toThrow(MissingJustificationError);

    expect(auditLogStore.entries).toHaveLength(1);
  });

  test("fails when role is invalid", () => {
    expect(() =>
      assignRoleToAdministrator(
        administratorStore,
        roleAssignmentStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "target-admin",
        "INVALID_ROLE" as AdminRole,
        "grant invalid role",
        "req-5",
        fixedNow
      )
    ).toThrow(InvalidRoleError);

    expect(auditLogStore.entries).toHaveLength(1);
  });

  test("fails when actor lacks role authority", () => {
    expect(() =>
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
        "req-6",
        fixedNow
      )
    ).toThrow(UnauthorizedRoleAssignmentError);

    expect(auditLogStore.entries).toHaveLength(1);
    expect(
      roleAssignmentStore.getRolesForAdmin("target-admin").size
    ).toBe(0);
  });
});
