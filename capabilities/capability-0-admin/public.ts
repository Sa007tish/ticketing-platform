/**
 * Capability 0 — Public Surface
 *
 * This file defines the ONLY symbols that may be imported
 * by other capabilities.
 *
 * Everything not exported here is constitutionally internal.
 */

// =====================
// Infrastructure
// =====================

export type { IdGenerator } from "./src/idGenerator";
export { DeterministicIdGenerator } from "./src/idGenerator";

// =====================
// Errors (Read-only)
// =====================

// capabilities/capability-0-admin/public.ts

export {
  Capability0Error,
  UnauthenticatedAdminError,
  UnauthorizedRoleAssignmentError,
  InvalidRoleError,
  MissingJustificationError,
  TargetAdminNotFoundError,
  LastAuditAdminRemovalError,
  ReplayRequestDetectedError,
} from "./src/errors";
