/**
 * Capability 1 — Public Surface
 *
 * This file defines the ONLY symbols that may be imported
 * by other capabilities.
 *
 * Everything not exported here is constitutionally internal.
 */

// =====================
// Execution
// =====================

export { registerUser } from "./registerUser";
export { authenticateUser } from "./authenticateUser";

// =====================
// Verification (Read-only)
// =====================

export { verifyAuthentication } from "./verifyAuthentication";

// =====================
// Types (Read-only)
// =====================

export type {
  UserId,
  AuthenticationProof,
  AuthenticationSecret,
} from "./types";

// =====================
// Errors (Read-only)
// =====================

export {
  AuthenticationFailedError,
  UserNotFoundError,
  InvalidAuthenticationProofError,
  ReplayDetectedError,
} from "./errors";
