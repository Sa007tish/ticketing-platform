import { AdminRole } from "./types";
import {
  UnauthenticatedAdminError,
  TargetAdminNotFoundError,
  MissingJustificationError,
  InvalidRoleError,
  UnauthorizedRoleAssignmentError,
  ReplayRequestDetectedError,
} from "./errors";
import {
  AdministratorIdentityStore,
  RoleAssignmentStore,
  AuditLogStore,
  ProcessedRequestRegistry,
} from "./stores";
import { IdGenerator } from "./idGenerator";

/* ============================================================
 * Capability 0 — Assign Role to Administrator
 * (STRICT canonical structure)
 * ============================================================
 */

export function assignRoleToAdministrator(
  administratorStore: AdministratorIdentityStore,
  roleAssignmentStore: RoleAssignmentStore,
  auditLogStore: AuditLogStore,
  processedRequestRegistry: ProcessedRequestRegistry,
  idGenerator: IdGenerator,
  actorAdminId: string,
  targetAdminId: string,
  role: AdminRole,
  justification: string,
  requestId: string,
  now: Date
): void {
  /* ------------------------------------------------------------
   * Replay check (FIRST — canonical)
   * ------------------------------------------------------------
   */
  if (processedRequestRegistry.has(requestId)) {
    auditLogStore.append({
      auditId: idGenerator.nextId(),
      timestamp: now,
      actorAdminId,
      action: "ASSIGN_ROLE",
      targetAdminId,
      justification,
      outcome: "FAILURE",
      failureReason: "REPLAY_REQUEST_DETECTED",
      requestId,
    });

    processedRequestRegistry.record({ requestId, processedAt: now });
    throw new ReplayRequestDetectedError();
  }

  /* ------------------------------------------------------------
   * Authentication
   * ------------------------------------------------------------
   */
  const actorAdmin = administratorStore.getById(actorAdminId);
  if (!actorAdmin) {
    auditLogStore.append({
      auditId: idGenerator.nextId(),
      timestamp: now,
      actorAdminId,
      action: "ASSIGN_ROLE",
      targetAdminId,
      justification,
      outcome: "FAILURE",
      failureReason: "UNAUTHENTICATED_ADMIN",
      requestId,
    });

    processedRequestRegistry.record({ requestId, processedAt: now });
    throw new UnauthenticatedAdminError();
  }

  /* ------------------------------------------------------------
   * Target validation
   * ------------------------------------------------------------
   */
  const targetAdmin = administratorStore.getById(targetAdminId);
  if (!targetAdmin) {
    auditLogStore.append({
      auditId: idGenerator.nextId(),
      timestamp: now,
      actorAdminId,
      action: "ASSIGN_ROLE",
      targetAdminId,
      justification,
      outcome: "FAILURE",
      failureReason: "TARGET_ADMIN_NOT_FOUND",
      requestId,
    });

    processedRequestRegistry.record({ requestId, processedAt: now });
    throw new TargetAdminNotFoundError();
  }

  /* ------------------------------------------------------------
   * Justification validation
   * ------------------------------------------------------------
   */
  if (!justification || justification.trim() === "") {
    auditLogStore.append({
      auditId: idGenerator.nextId(),
      timestamp: now,
      actorAdminId,
      action: "ASSIGN_ROLE",
      targetAdminId,
      justification,
      outcome: "FAILURE",
      failureReason: "MISSING_JUSTIFICATION",
      requestId,
    });

    processedRequestRegistry.record({ requestId, processedAt: now });
    throw new MissingJustificationError();
  }

  /* ------------------------------------------------------------
   * Role validation (closed world)
   * ------------------------------------------------------------
   */
  if (!Object.values(AdminRole).includes(role)) {
    auditLogStore.append({
      auditId: idGenerator.nextId(),
      timestamp: now,
      actorAdminId,
      action: "ASSIGN_ROLE",
      targetAdminId,
      justification,
      outcome: "FAILURE",
      failureReason: "INVALID_ROLE",
      requestId,
    });

    processedRequestRegistry.record({ requestId, processedAt: now });
    throw new InvalidRoleError();
  }

  /* ------------------------------------------------------------
   * Authorization
   * Actor must already hold the role they are assigning
   * ------------------------------------------------------------
   */
  const actorRoles = roleAssignmentStore.getRolesForAdmin(actorAdminId);
  if (!actorRoles.has(role)) {
    auditLogStore.append({
      auditId: idGenerator.nextId(),
      timestamp: now,
      actorAdminId,
      action: "ASSIGN_ROLE",
      targetAdminId,
      justification,
      outcome: "FAILURE",
      failureReason: "UNAUTHORIZED_ROLE_ASSIGNMENT",
      requestId,
    });

    processedRequestRegistry.record({ requestId, processedAt: now });
    throw new UnauthorizedRoleAssignmentError();
  }

  /* ------------------------------------------------------------
   * State mutation
   * ------------------------------------------------------------
   */
  roleAssignmentStore.assign({
    adminId: targetAdminId,
    role,
    assignedAt: now,
    assignedByAdminId: actorAdminId,
  });

  /* ------------------------------------------------------------
   * Audit log — SUCCESS
   * ------------------------------------------------------------
   */
  auditLogStore.append({
    auditId: idGenerator.nextId(),
    timestamp: now,
    actorAdminId,
    action: "ASSIGN_ROLE",
    targetAdminId,
    justification,
    outcome: "SUCCESS",
    requestId,
  });

  /* ------------------------------------------------------------
   * Replay registry — FINAL
   * ------------------------------------------------------------
   */
  processedRequestRegistry.record({ requestId, processedAt: now });
}
