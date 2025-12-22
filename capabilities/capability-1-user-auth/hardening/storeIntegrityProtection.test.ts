// capabilities/capability-1-user-auth/hardening/storeIntegrityProtection.test.ts

import { registerUser } from "../registerUser";
import { authenticateUser } from "../authenticateUser";
import {
  InMemoryUserStore,
  InMemoryAuthenticationStore,
} from "../inMemoryStores";
import { DeterministicIdGenerator } from "../../capability-0-admin/idGenerator";

test("failed authentication does not mutate stores", () => {
  const now = new Date("2025-01-01T00:00:00Z");

  const userStore = new InMemoryUserStore();
  const authenticationStore = new InMemoryAuthenticationStore();
  const idGenerator = new DeterministicIdGenerator([
    "id-1",
    "id-2",
    "id-3",
  ]);

  const user = registerUser({ now }, userStore, idGenerator);

  expect(() =>
    authenticateUser(
      {
        userId: user.userId,
        authenticationSecret: "invalid-secret",
        now,
      },
      userStore,
      authenticationStore,
      idGenerator
    )
  ).toThrow();

  // store must remain untouched after failed authentication
  expect(
    authenticationStore.getByProofId("non-existent-proof-id")
  ).toBeUndefined();
});
