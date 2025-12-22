// capabilities/capability-1-user-auth/authenticateUser.ts

import {
  AuthenticationProof,
  AuthenticationSecret,
  UserId,
} from "./types";
import { UserStore, AuthenticationStore } from "./stores";
import { IdGenerator } from "../../capability-0-admin/src/idGenerator";
import {
  UserNotFoundError,
  InvalidAuthenticationError,
} from "./errors";

export interface AuthenticateUserInput {
  userId: UserId;
  authenticationSecret: AuthenticationSecret;
  now: Date;
}

export function authenticateUser(
  input: AuthenticateUserInput,
  userStore: UserStore,
  authenticationStore: AuthenticationStore,
  idGenerator: IdGenerator
): AuthenticationProof {
  const user = userStore.getById(input.userId);

  if (!user) {
    throw new UserNotFoundError();
  }

  if (user.authenticationSecret !== input.authenticationSecret) {
    throw new InvalidAuthenticationError();
  }

  const proof: AuthenticationProof = {
    proofId: idGenerator.nextId(),
    userId: user.userId,
    issuedAt: input.now,
  };

  authenticationStore.save(proof);

  return proof;
}
