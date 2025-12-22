import { assignRoleToAdministrator } from "../src/assignRoleToAdministrator";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { AdminRole } from "../src/types";
import { DeterministicIdGenerator } from "../src/idGenerator";

test("actor without authority cannot assign role", () => {
  const now = new Date();

  const adminStore = new InMemoryAdministratorIdentityStore();
  const roleStore = new InMemoryRoleAssignmentStore();
  const auditLog = new InMemoryAuditLogStore();
  const registry = new InMemoryProcessedRequestRegistry();
  const idGen = new DeterministicIdGenerator();

  adminStore.create({
    adminId: "actor",
    createdAt: now,
    isAttendee: false,
    isOrganiser: false,
    status: "ACTIVE",
  });

  adminStore.create({
    adminId: "target",
    createdAt: now,
    isAttendee: false,
    isOrganiser: false,
    status: "ACTIVE",
  });

  expect(() =>
    assignRoleToAdministrator(
      adminStore,
      roleStore,
      auditLog,
      registry,
      idGen,
      "actor",
      "target",
      AdminRole.AUDIT_ADMIN,
      "attempt unauthorized",
      "req-2",
      now
    )
  ).toThrow();

  expect(roleStore.getRolesForAdmin("target").size).toBe(0);
  expect(auditLog.readAll().length).toBe(1);
});
