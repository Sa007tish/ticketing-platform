/**
 * Capability 0 — Public Surface
 *
 * This file defines the ONLY symbols that may be imported
 * by other capabilities.
 *
 * Everything not exported here is constitutionally internal.
 */

// =====================
// Decisions (Read-only)
// =====================

export { authorizeAdminAction } from "./src/authorizeAdminAction";

// =====================
// Infrastructure
// =====================

export { DeterministicIdGenerator } from "./src/idGenerator";

// =====================
// Types (Read-only)
// =====================

export type {
  AdminId,
  AdminRole,
  ActorContext,
} from "./src/types";

// =====================
// Errors (Read-only)
// =====================

export {
  UnauthorizedError,
  UnauthenticatedError,
  ReplayDetectedError,
} from "./src/errors";
