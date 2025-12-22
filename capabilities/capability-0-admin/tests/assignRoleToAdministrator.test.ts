import { assignRoleToAdministrator } from "../src/assignRoleToAdministrator";
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
} from "../src/errors";

describe("assignRoleToAdministrator", () => {
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

  test("successfully assigns role", () => {
    roleStore.assign({
      adminId: "actor-admin",
      role: AdminRole.SUPPORT_ADMIN,
      assignedAt: fixedNow,
      assignedByAdminId: "system",
    });

    assignRoleToAdministrator(
      administratorStore,
      roleStore,
      auditLogStore,
      processedRequestRegistry,
      idGenerator,
      "actor-admin",
      "target-admin",
      AdminRole.SUPPORT_ADMIN,
      "assign support role",
      "req-1",
      fixedNow
    );

    expect(roleStore.getRolesForAdmin("target-admin").has(AdminRole.SUPPORT_ADMIN)).toBe(
      true
    );
    expect(auditLogStore.readAll()).toHaveLength(1);
    expect(processedRequestRegistry.has("req-1")).toBe(true);
  });

  test("rejects replay request", () => {
    processedRequestRegistry.record({ requestId: "req-1", processedAt: fixedNow });

    expect(() =>
      assignRoleToAdministrator(
        administratorStore,
        roleStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "target-admin",
        AdminRole.SUPPORT_ADMIN,
        "assign support role",
        "req-1",
        fixedNow
      )
    ).toThrow(ReplayRequestDetectedError);
  });

  test("fails for unauthenticated actor", () => {
    expect(() =>
      assignRoleToAdministrator(
        administratorStore,
        roleStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "unknown-admin",
        "target-admin",
        AdminRole.SUPPORT_ADMIN,
        "assign support role",
        "req-2",
        fixedNow
      )
    ).toThrow(UnauthenticatedAdminError);
  });

  test("fails when target admin does not exist", () => {
    expect(() =>
      assignRoleToAdministrator(
        administratorStore,
        roleStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "missing-admin",
        AdminRole.SUPPORT_ADMIN,
        "assign support role",
        "req-3",
        fixedNow
      )
    ).toThrow(TargetAdminNotFoundError);
  });

  test("fails when justification is missing", () => {
    expect(() =>
      assignRoleToAdministrator(
        administratorStore,
        roleStore,
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
  });

  test("fails for invalid role", () => {
    expect(() =>
      assignRoleToAdministrator(
        administratorStore,
        roleStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "target-admin",
        "INVALID_ROLE" as AdminRole,
        "assign invalid role",
        "req-5",
        fixedNow
      )
    ).toThrow(InvalidRoleError);
  });

  test("fails when actor lacks authority", () => {
    expect(() =>
      assignRoleToAdministrator(
        administratorStore,
        roleStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "target-admin",
        AdminRole.SUPPORT_ADMIN,
        "assign support role",
        "req-6",
        fixedNow
      )
    ).toThrow(UnauthorizedRoleAssignmentError);
  });
});
