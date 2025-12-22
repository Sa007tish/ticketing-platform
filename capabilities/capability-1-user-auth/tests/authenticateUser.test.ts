// capabilities/capability-1-user-auth/tests/authenticateUser.test.ts

import { registerUser } from "../registerUser";
import { authenticateUser } from "../authenticateUser";
import {
  User,
  UserId,
  AuthenticationSecret,
  AuthenticationProof,
  AuthenticationProofId,
} from "../types";
import {
  UserStore,
  AuthenticationStore,
} from "../stores";
import {
  UserNotFoundError,
  InvalidAuthenticationError,
} from "../errors";
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

class TestAuthenticationStore implements AuthenticationStore {
  private proofs = new Map<AuthenticationProofId, AuthenticationProof>();

  save(proof: AuthenticationProof): void {
    this.proofs.set(proof.proofId, proof);
  }

  getByProofId(
    proofId: AuthenticationProofId
  ): AuthenticationProof | undefined {
    return this.proofs.get(proofId);
  }
}

describe("authenticateUser", () => {
  test("Successful authentication with valid secret — Explicit authentication", () => {
    const userStore = new TestUserStore();
    const authenticationStore = new TestAuthenticationStore();

    const idGenerator = new DeterministicIdGenerator();

    const registration = registerUser(
      { now: NOW },
      userStore,
      idGenerator
    );

    const proof = authenticateUser(
      {
        userId: registration.user.userId,
        authenticationSecret: registration.authenticationSecret,
        now: NOW,
      },
      userStore,
      authenticationStore,
      idGenerator
    );

    expect(proof.userId).toBe(registration.user.userId);
    expect(proof.issuedAt).toEqual(NOW);

    const persisted = authenticationStore.getByProofId(proof.proofId);
    expect(persisted).toEqual(proof);
  });

  test("Authentication fails for non-existent user — No implicit users", () => {
    const userStore = new TestUserStore();
    const authenticationStore = new TestAuthenticationStore();
    const idGenerator = new DeterministicIdGenerator();

    expect(() =>
      authenticateUser(
        {
          userId: "missing-user" as UserId,
          authenticationSecret: "secret" as AuthenticationSecret,
          now: NOW,
        },
        userStore,
        authenticationStore,
        idGenerator
      )
    ).toThrow(UserNotFoundError);
  });

  test("Authentication fails with invalid secret — Authentication is not identity lookup", () => {
    const userStore = new TestUserStore();
    const authenticationStore = new TestAuthenticationStore();
    const idGenerator = new DeterministicIdGenerator();

    const registration = registerUser(
      { now: NOW },
      userStore,
      idGenerator
    );

    expect(() =>
      authenticateUser(
        {
          userId: registration.user.userId,
          authenticationSecret:
            "invalid-secret" as AuthenticationSecret,
          now: NOW,
        },
        userStore,
        authenticationStore,
        idGenerator
      )
    ).toThrow(InvalidAuthenticationError);
  });
});
