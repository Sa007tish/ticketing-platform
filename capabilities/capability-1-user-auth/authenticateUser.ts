// capabilities/capability-1-user-auth/authenticateUser.ts

import {
  AuthenticationProof,
  AuthenticationSecret,
  UserId,
  AuthenticationProofId
} from "./types";
import { UserStore, AuthenticationStore } from "./stores";
import { IdGenerator } from "../capability-0-admin/idGenerator";

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
): AuthenticationProof;
