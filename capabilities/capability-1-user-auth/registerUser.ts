// capabilities/capability-1-user-auth/registerUser.ts

import { User } from "./types";
import { UserStore } from "./stores";
import { IdGenerator } from "../capability-0-admin/src/idGenerator";

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
): RegisterUserResult {
  const userId = idGenerator.nextId() as UserId;

  const authenticationSecret = `secret-${userId}`;

  const user: User = {
  userId,
  createdAt: input.now,
};

  userStore.create(user);

  return {
    user,
    authenticationSecret,
  };
}
