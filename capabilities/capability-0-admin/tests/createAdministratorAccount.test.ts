/* ============================================================
 * Capability 0 — createAdministratorAccount Tests
 * ============================================================
 */

import { createAdministratorAccount } from "../src/createAdministratorAccount";
import {
  InMemoryAdministratorIdentityStore,
  InMemoryAuditLogStore,
  InMemoryProcessedRequestRegistry,
} from "../src/inMemoryStores";
import { DeterministicIdGenerator } from "../src/idGenerator";
import { UnauthenticatedAdminError } from "../src/errors";

describe("createAdministratorAccount", () => {
  const now = new Date("2025-01-01T00:00:00Z");

  test("successfully creates a new administrator with audit log and replay record", () => {
    const identityStore = new InMemoryAdministratorIdentityStore();
    const auditLogStore = new InMemoryAuditLogStore();
    const requestRegistry = new InMemoryProcessedRequestRegistry();
    const idGenerator = new DeterministicIdGenerator();

    createAdministratorAccount(
      "admin-1",
      "req-1",
      "new-admin",
      now,
      identityStore,
      auditLogStore,
      requestRegistry,
      idGenerator
    );

    // Identity created
    const identity = identityStore.getById("new-admin");
    expect(identity).toBeDefined();
    expect(identity?.adminId).toBe("new-admin");
    expect(identity?.status).toBe("ACTIVE");

    // Audit log written
    const logs = auditLogStore.readAll();
    expect(logs).toHaveLength(1);
    expect(logs[0].auditId).toBe("test-id-1");
    expect(logs[0].actorAdminId).toBe("admin-1");
    expect(logs[0].outcome).toBe("SUCCESS");

    // Replay registry updated
    expect(requestRegistry.has("req-1")).toBe(true);
  });

  test("throws UnauthenticatedAdminError and logs failure when actor is missing", () => {
    const identityStore = new InMemoryAdministratorIdentityStore();
    const auditLogStore = new InMemoryAuditLogStore();
    const requestRegistry = new InMemoryProcessedRequestRegistry();
    const idGenerator = new DeterministicIdGenerator();

    expect(() =>
      createAdministratorAccount(
        undefined,
        "req-2",
        "new-admin",
        now,
        identityStore,
        auditLogStore,
        requestRegistry,
        idGenerator
      )
    ).toThrow(UnauthenticatedAdminError);

    // Identity NOT created
    expect(identityStore.getById("new-admin")).toBeUndefined();

    // Audit log written
    const logs = auditLogStore.readAll();
    expect(logs).toHaveLength(1);
    expect(logs[0].outcome).toBe("FAILURE");

    // Replay registry updated
    expect(requestRegistry.has("req-2")).toBe(true);
  });

  test("rejects replayed requestId and logs failure without mutating state", () => {
    const identityStore = new InMemoryAdministratorIdentityStore();
    const auditLogStore = new InMemoryAuditLogStore();
    const requestRegistry = new InMemoryProcessedRequestRegistry();
    const idGenerator = new DeterministicIdGenerator();

    // First call succeeds
    createAdministratorAccount(
      "admin-1",
      "req-replay",
      "new-admin",
      now,
      identityStore,
      auditLogStore,
      requestRegistry,
      idGenerator
    );

    // Second call with same requestId should fail
    expect(() =>
      createAdministratorAccount(
        "admin-1",
        "req-replay",
        "another-admin",
        now,
        identityStore,
        auditLogStore,
        requestRegistry,
        idGenerator
      )
    ).toThrowError();

    // No second identity created
    expect(identityStore.getById("another-admin")).toBeUndefined();

    // Audit logs: one SUCCESS, one FAILURE
    const logs = auditLogStore.readAll();
    expect(logs).toHaveLength(2);
    expect(logs[0].outcome).toBe("SUCCESS");
    expect(logs[1].outcome).toBe("FAILURE");

    // Replay registry still contains the requestId
    expect(requestRegistry.has("req-replay")).toBe(true);
  });
});
