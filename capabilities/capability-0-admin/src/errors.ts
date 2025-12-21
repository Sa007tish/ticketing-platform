/* ============================================================
 * Capability 0 — Typed Governance Errors
 * ============================================================
 * Errors are explicit, typed, and non-ignorable.
 * ============================================================
 */

export abstract class Capability0Error extends Error {
  abstract readonly code: string;
}

/* ---------- Authentication / Authorization ---------- */

export class UnauthenticatedAdminError extends Capability0Error {
  readonly code = "UNAUTHENTICATED_ADMIN";
}

export class UnauthorizedRoleAssignmentError extends Capability0Error {
  readonly code = "UNAUTHORIZED_ROLE_ASSIGNMENT";
}

/* ---------- Validation ---------- */

export class InvalidRoleError extends Capability0Error {
  readonly code = "INVALID_ROLE";
}

export class MissingJustificationError extends Capability0Error {
  readonly code = "MISSING_JUSTIFICATION";
}

export class TargetAdminNotFoundError extends Capability0Error {
  readonly code = "TARGET_ADMIN_NOT_FOUND";
}

/* ---------- Invariants ---------- */

export class LastAuditAdminRemovalError extends Capability0Error {
  readonly code = "LAST_AUDIT_ADMIN_REMOVAL";
}

export class ReplayRequestDetectedError extends Capability0Error {
  readonly code = "REPLAY_REQUEST_DETECTED";
}
