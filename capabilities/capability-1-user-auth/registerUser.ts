// capabilities/capability-1-user-auth/registerUser.ts

import { User, UserId } from "./types";
import { UserStore } from "./stores";
import { IdGenerator } from "../capability-0-admin/src/idGenerator";

export interface RegisterUserInput {
  now: Date;
}

export function registerUser(
  input: RegisterUserInput,
  userStore: UserStore,
  idGenerator: IdGenerator
): User {
  const userId = idGenerator.nextId();

  const authenticationSecret = `secret-${userId}`;

  const user: User = {
  userId,
  createdAt: input.now,
  authenticationSecret,
};

  userStore.create(user);

  return {
    user,
    authenticationSecret,
  };
}
