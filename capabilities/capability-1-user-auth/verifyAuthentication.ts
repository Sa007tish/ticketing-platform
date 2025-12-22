// capabilities/capability-1-user-auth/verifyAuthentication.ts

import { AuthenticationProof } from "./types";
import { AuthenticationStore } from "./stores";
import { InvalidAuthenticationError } from "./errors";

export function verifyAuthentication(
  proofId: string,
  authenticationStore: AuthenticationStore
): AuthenticationProof;
