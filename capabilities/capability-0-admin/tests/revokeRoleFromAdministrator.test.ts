```ts
import { revokeRoleFromAdministrator } from "../revokeRoleFromAdministrator";
import { AdminRole } from "../types";
import {
  UnauthenticatedAdminError,
  TargetAdminNotFoundError,
  MissingJustificationError,
  InvalidRoleError,
  UnauthorizedRoleAssignmentError,
  ReplayRequestDetectedError,
  LastAuditAdminRemovalError,
} from "../errors";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { DeterministicIdGenerator } from "../idGenerator";

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
  });

  test("successfully revokes role", () => {
    roleAssignmentStore.assignRole({
      adminId: "actor-admin",
      role: AdminRole.SUPPORT_ADMIN,
      assignedAt: fixedNow,
      assignedByAdminId: "system",
    });

    roleAssignmentStore.assignRole({
      adminId: "target-admin",
      role: AdminRole.SUPPORT_ADMIN,
      assignedAt: fixedNow,
      assignedByAdminId: "system",
    });

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
      "req-1",
      fixedNow
    );

    expect(
      roleAssignmentStore.getRolesForAdmin("target-admin").has(AdminRole.SUPPORT_ADMIN)
    ).toBe(false);
    expect(auditLogStore.entries).toHaveLength(1);
    expect(auditLogStore.entries[0].outcome).toBe("SUCCESS");
    expect(processedRequestRegistry.has("req-1")).toBe(true);
  });

  test("rejects replay request", () => {
    processedRequestRegistry.record({ requestId: "req-1", processedAt: fixedNow });

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
      revokeRoleFromAdministrator(
        administratorStore,
        roleAssignmentStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "unknown-admin",
        "target-admin",
        AdminRole.SUPPORT_ADMIN,
        "revoke support role",
        "req-2",
        fixedNow
      )
    ).toThrow(UnauthenticatedAdminError);

    expect(auditLogStore.entries).toHaveLength(1);
    expect(processedRequestRegistry.has("req-2")).toBe(true);
  });

  test("fails when target admin not found", () => {
    roleAssignmentStore.assignRole({
      adminId: "actor-admin",
      role: AdminRole.SUPPORT_ADMIN,
      assignedAt: fixedNow,
      assignedByAdminId: "system",
    });

    expect(() =>
      revokeRoleFromAdministrator(
        administratorStore,
        roleAssignmentStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "missing-admin",
        AdminRole.SUPPORT_ADMIN,
        "revoke support role",
        "req-3",
        fixedNow
      )
    ).toThrow(TargetAdminNotFoundError);

    expect(auditLogStore.entries).toHaveLength(1);
  });

  test("fails when justification is missing", () => {
    roleAssignmentStore.assignRole({
      adminId: "actor-admin",
      role: AdminRole.SUPPORT_ADMIN,
      assignedAt: fixedNow,
      assignedByAdminId: "system",
    });

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
        "",
        "req-4",
        fixedNow
      )
    ).toThrow(MissingJustificationError);

    expect(auditLogStore.entries).toHaveLength(1);
  });

  test("fails when role is invalid", () => {
    roleAssignmentStore.assignRole({
      adminId: "actor-admin",
      role: AdminRole.SUPPORT_ADMIN,
      assignedAt: fixedNow,
      assignedByAdminId: "system",
    });

    expect(() =>
      revokeRoleFromAdministrator(
        administratorStore,
        roleAssignmentStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "actor-admin",
        "target-admin",
        "INVALID_ROLE" as AdminRole,
        "revoke invalid role",
        "req-5",
        fixedNow
      )
    ).toThrow(InvalidRoleError);

    expect(auditLogStore.entries).toHaveLength(1);
  });

  test("fails when actor lacks role authority", () => {
    roleAssignmentStore.assignRole({
      adminId: "target-admin",
      role: AdminRole.SUPPORT_ADMIN,
      assignedAt: fixedNow,
      assignedByAdminId: "system",
    });

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
        "req-6",
        fixedNow
      )
    ).toThrow(UnauthorizedRoleAssignmentError);

    expect(auditLogStore.entries).toHaveLength(1);
    expect(
      roleAssignmentStore.getRolesForAdmin("target-admin").has(AdminRole.SUPPORT_ADMIN)
    ).toBe(true);
  });

  test("fails when attempting to revoke the last AUDIT_ADMIN", () => {
    roleAssignmentStore.assignRole({
      adminId: "actor-admin",
      role: AdminRole.AUDIT_ADMIN,
      assignedAt: fixedNow,
      assignedByAdminId: "system",
    });

    roleAssignmentStore.assignRole({
      adminId: "target-admin",
      role: AdminRole.AUDIT_ADMIN,
      assignedAt: fixedNow,
      assignedByAdminId: "system",
    });

    // Remove AUDIT_ADMIN from actor so target becomes the last one
    roleAssignmentStore.removeRole("actor-admin", AdminRole.AUDIT_ADMIN);

    expect(() =>
      revokeRoleFromAdministrator(
        administratorStore,
        roleAssignmentStore,
        auditLogStore,
        processedRequestRegistry,
        idGenerator,
        "target-admin",
        "target-admin",
        AdminRole.AUDIT_ADMIN,
        "attempt last audit admin removal",
        "req-7",
        fixedNow
      )
    ).toThrow(LastAuditAdminRemovalError);

    expect(auditLogStore.entries).toHaveLength(1);
    expect(auditLogStore.entries[0].outcome).toBe("FAILURE");
    expect(
      roleAssignmentStore.getRolesForAdmin("target-admin").has(AdminRole.AUDIT_ADMIN)
    ).toBe(true);
  });
});
```
