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
      roleAssignmentStore.getRolesForAdmin("target-admin").has(AdminRole.SUPPORT_ADMIN)
    ).toBe(true);

    const logs = auditLogStore.getAll();
    expect(logs).toHaveLength(1);
    expect(logs[0].outcome).toBe("SUCCESS");
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

    expect(auditLogStore.getAll()).toHaveLength(1);
  });

  test("fails when actor lacks authority", () => {
    expect(() =>
      assignRoleToAdministrator(
        administratorStore,
        roleAssignmentStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "target-admin",
        AdminRole.AUDIT_ADMIN,
        "unauthorized grant",
        "req-2",
        fixedNow
      )
    ).toThrow(UnauthorizedRoleAssignmentError);
  });
});
