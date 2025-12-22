// capabilities/capability-1-user-auth/hardening/replayProtection.test.ts

import { registerUser } from "../registerUser";
import { authenticateUser } from "../authenticateUser";
import { verifyAuthentication } from "../verifyAuthentication";
import {
  InMemoryUserStore,
  InMemoryAuthenticationStore,
} from "../inMemoryStores";
import { DeterministicIdGenerator } from "../../capability-0-admin/public";

test("verifyAuthentication is idempotent and replay does not mutate state", () => {
  const now = new Date("2025-01-01T00:00:00Z");

  const userStore = new InMemoryUserStore();
  const authenticationStore = new InMemoryAuthenticationStore();
  const idGenerator = new DeterministicIdGenerator(); // ✅ fixed

  const registration = registerUser({ now }, userStore, idGenerator);

  const proof = authenticateUser(
    {
      userId: registration.user.userId,                 // ✅ fixed
      authenticationSecret: registration.user.authenticationSecret,
      now,
    },
    userStore,
    authenticationStore,
    idGenerator
  );

  const firstVerification = verifyAuthentication(
    proof.proofId,
    authenticationStore
  );

  const secondVerification = verifyAuthentication(
    proof.proofId,
    authenticationStore
  );

  expect(firstVerification).toEqual(secondVerification);
});
