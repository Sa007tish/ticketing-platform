/* ============================================================
 * Capability 0 — Create Administrator Account
 * ============================================================
 * Mutating function with full audit + replay discipline.
 * ============================================================
 */

import {
  AdministratorIdentityStore,
  AuditLogStore,
  ProcessedRequestRegistry,
} from "./stores";

import { AdministratorIdentity } from "./types";
import {
  UnauthenticatedAdminError,
  ReplayRequestDetectedError,
} from "./errors";
import { IdGenerator } from "./idGenerator";

export function createAdministratorAccount(
  actorAdminId: string | undefined,
  requestId: string,
  newAdminId: string,
  now: Date,
  identityStore: AdministratorIdentityStore,
  auditLogStore: AuditLogStore,
  requestRegistry: ProcessedRequestRegistry,
  idGenerator: IdGenerator
): void {
  if (!actorAdminId) {
    auditLogStore.append({
      auditId: idGenerator.nextId(),
      timestamp: now,
      actorAdminId: "UNKNOWN",
      action: "CREATE_ADMIN",
      targetAdminId: newAdminId,
      justification: "N/A",
      outcome: "FAILURE",
      failureReason: "Unauthenticated admin",
      requestId,
    });
    requestRegistry.record({ requestId, processedAt: now });
    throw new UnauthenticatedAdminError();
  }

  if (requestRegistry.has(requestId)) {
    auditLogStore.append({
      auditId: idGenerator.nextId(),
      timestamp: now,
      actorAdminId,
      action: "CREATE_ADMIN",
      targetAdminId: newAdminId,
      justification: "N/A",
      outcome: "FAILURE",
      failureReason: "Replay request detected",
      requestId,
    });
    requestRegistry.record({ requestId, processedAt: now });
    throw new ReplayRequestDetectedError();
  }

  const identity: AdministratorIdentity = {
    adminId: newAdminId,
    createdAt: now,
    isAttendee: false,
    isOrganiser: false,
    status: "ACTIVE",
  };

  auditLogStore.append({
    auditId: idGenerator.nextId(),
    timestamp: now,
    actorAdminId,
    action: "CREATE_ADMIN",
    targetAdminId: newAdminId,
    justification: "Create administrator",
    outcome: "SUCCESS",
    requestId,
  });

  identityStore.create(identity);
  requestRegistry.record({ requestId, processedAt: now });
}
