/* ============================================================
 * Capability 0 — Pure Authorization Check
 * ============================================================
 * This function answers a single question:
 * Does this administrator currently hold this role?
 *
 * No side effects.
 * No audit logging.
 * No fallback logic.
 * ============================================================
 */

import { RoleAssignmentStore } from "./stores";
import { AdminRole } from "./types";
import { UnauthenticatedAdminError } from "./errors";

export function authorizeAdminAction(
  actorAdminId: string | undefined,
  requiredRole: AdminRole,
  roleStore: RoleAssignmentStore
): boolean {
  if (!actorAdminId) {
    throw new UnauthenticatedAdminError();
  }

  const roles = roleStore.getRolesForAdmin(actorAdminId);
  return roles.has(requiredRole);
}
