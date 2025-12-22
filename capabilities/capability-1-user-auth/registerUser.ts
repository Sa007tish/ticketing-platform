// capabilities/capability-1-user-auth/registerUser.ts

import { User } from "./types";
import { UserStore } from "./stores";
import { IdGenerator } from "../capability-0-admin/idGenerator";

export interface RegisterUserInput {
  now: Date;
}

export interface RegisterUserResult {
  user: User;
  authenticationSecret: string;
}

export function registerUser(
  input: RegisterUserInput,
  userStore: UserStore,
  idGenerator: IdGenerator
): RegisterUserResult;
