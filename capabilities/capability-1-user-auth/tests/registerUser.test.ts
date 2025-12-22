// capabilities/capability-1-user-auth/tests/registerUser.test.ts

import { registerUser } from "../registerUser";
import { User, UserId } from "../types";
import { UserStore } from "../stores";
import { DeterministicIdGenerator } from "../../capability-0-admin/src/idGenerator";

const NOW = new Date("2024-01-01T00:00:00.000Z");

class TestUserStore implements UserStore {
  private users = new Map<UserId, User>();

  create(user: User): void {
    this.users.set(user.userId, user);
  }

  getById(userId: UserId): User | undefined {
    return this.users.get(userId);
  }
}

describe("registerUser", () => {
  test("Successful user registration — Identity stability & system-generated IDs", () => {
    const userStore = new TestUserStore();
    const idGenerator = new DeterministicIdGenerator();

    const result = registerUser(
      { now: NOW },
      userStore,
      idGenerator
    );

    expect(result.user.userId).toBe("user-1");
    expect(result.user.createdAt).toEqual(NOW);
    expect(result.authenticationSecret).toBeDefined();

    const persisted = userStore.getById(result.user.userId);
    expect(persisted).toEqual(result.user);
  });

  test("Multiple users can be registered — Multi-user support without collision", () => {
    const userStore = new TestUserStore();
    const idGenerator = new DeterministicIdGenerator();

    const r1 = registerUser({ now: NOW }, userStore, idGenerator);
    const r2 = registerUser({ now: NOW }, userStore, idGenerator);

    expect(r1.user.userId).not.toBe(r2.user.userId);
    expect(r1.authenticationSecret).not.toBe(r2.authenticationSecret);

    expect(userStore.getById(r1.user.userId)).toBeDefined();
    expect(userStore.getById(r2.user.userId)).toBeDefined();
  });
});
