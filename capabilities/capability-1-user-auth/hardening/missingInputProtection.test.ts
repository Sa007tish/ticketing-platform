// capabilities/capability-1-user-auth/hardening/missingInputProtection.test.ts

import { registerUser } from "../registerUser";
import { authenticateUser } from "../authenticateUser";
import { verifyAuthentication } from "../verifyAuthentication";
import {
  InMemoryUserStore,
  InMemoryAuthenticationStore,
} from "../inMemoryStores";
import { DeterministicIdGenerator } from "../../capability-0-admin/idGenerator";

test("missing or malformed input is rejected", () => {
  const userStore = new InMemoryUserStore();
  const authenticationStore = new InMemoryAuthenticationStore();
  const idGenerator = new DeterministicIdGenerator([
    "id-1",
    "id-2",
    "id-3",
  ]);

  // Missing `now`
  expect(() =>
    registerUser({} as any, userStore, idGenerator)
  ).toThrow();

  // Missing `authenticationSecret`
  expect(() =>
    authenticateUser(
      { userId: "u", now: new Date() } as any,
      userStore,
      authenticationStore,
      idGenerator
    )
  ).toThrow();

  // Invalid proof id
  expect(() =>
    verifyAuthentication(undefined as any, authenticationStore)
  ).toThrow();
});
