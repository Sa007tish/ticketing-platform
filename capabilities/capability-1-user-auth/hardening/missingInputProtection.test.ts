// capabilities/capability-1-user-auth/hardening/missingInputProtection.test.ts

import { registerUser } from "../registerUser";
import { authenticateUser } from "../authenticateUser";
import { verifyAuthentication } from "../verifyAuthentication";
import {
  InMemoryUserStore,
  InMemoryAuthenticationStore,
} from "../inMemoryStores";
import { DeterministicIdGenerator } from "../../capability-0-admin/src/idGenerator";

test("missing or malformed input is rejected", () => {
  const userStore = new InMemoryUserStore();
  const authenticationStore = new InMemoryAuthenticationStore();
  const idGenerator = new DeterministicIdGenerator([
    "id-1",
    "id-2",
    "id-3",
  ]);

  // @ts-expect-error
  expect(() => registerUser({}, userStore, idGenerator)).toThrow();

  // @ts-expect-error
  expect(() =>
    authenticateUser(
      { userId: "u", now: new Date() },
      userStore,
      authenticationStore,
      idGenerator
    )
  ).toThrow();

  // @ts-expect-error
  expect(() => verifyAuthentication(undefined, authenticationStore)).toThrow();
});
