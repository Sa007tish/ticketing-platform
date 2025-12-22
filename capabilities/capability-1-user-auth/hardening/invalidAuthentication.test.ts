// capabilities/capability-1-user-auth/hardening/invalidAuthentication.test.ts

import { registerUser } from "../registerUser";
import { authenticateUser } from "../authenticateUser";
import { verifyAuthentication } from "../verifyAuthentication";
import {
  InMemoryUserStore,
  InMemoryAuthenticationStore,
} from "../inMemoryStores";
import { DeterministicIdGenerator } from "../../capability-0-admin/src/idGenerator";
import { UserNotFoundError, InvalidAuthenticationError } from "../errors";

test("invalid authentication paths fail with correct errors", () => {
  const now = new Date("2025-01-01T00:00:00Z");

  const userStore = new InMemoryUserStore();
  const authenticationStore = new InMemoryAuthenticationStore();
  const idGenerator = new DeterministicIdGenerator([
    "id-1",
    "id-2",
    "id-3",
    "id-4",
  ]);

  expect(() =>
    authenticateUser(
      {
        userId: "nonExistentUserId",
        authenticationSecret: "someSecret",
        now,
      },
      userStore,
      authenticationStore,
      idGenerator
    )
  ).toThrow(UserNotFoundError);

  const user = registerUser({ now }, userStore, idGenerator);

  expect(() =>
    authenticateUser(
      {
        userId: user.userId,
        authenticationSecret: "incorrectSecret",
        now,
      },
      userStore,
      authenticationStore,
      idGenerator
    )
  ).toThrow(InvalidAuthenticationError);

  const validProof = authenticateUser(
    {
      userId: user.userId,
      authenticationSecret: user.authenticationSecret,
      now,
    },
    userStore,
    authenticationStore,
    idGenerator
  );

  const derivedInvalidProofId = `${validProof.proofId}-invalid`;

  expect(() =>
    verifyAuthentication(derivedInvalidProofId, authenticationStore)
  ).toThrow(InvalidAuthenticationError);
});
