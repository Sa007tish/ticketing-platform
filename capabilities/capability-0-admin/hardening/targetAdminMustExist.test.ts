import { assignRoleToAdministrator } from "../src/assignRoleToAdministrator";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryRoleAssignmentStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { AdminRole } from "../src/types";
import { DeterministicIdGenerator } from "../src/idGenerator";

test("assignment fails if target admin does not exist", () => {
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

  expect(() =>
    assignRoleToAdministrator(
      adminStore,
      roleStore,
      auditLog,
      registry,
      idGen,
      "actor",
      "missing",
      AdminRole.SUPPORT_ADMIN,
      "assign attempt",
      "req-4",
      now
    )
  ).toThrow();

  expect(auditLog.readAll().length).toBe(1);
});
