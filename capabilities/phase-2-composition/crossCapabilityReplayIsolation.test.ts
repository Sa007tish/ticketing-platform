/**
 * Phase 2 Composition Test
 *
 * Cross-Capability Replay Isolation
 *
 * This test proves that Capability 1 composes with Capability 0
 * strictly through public surfaces, and that replay protection
 * remains authoritative in Capability 0.
 */

import {
  DeterministicIdGenerator,
  ReplayRequestDetectedError,
} from "../capability-0-admin/public";

import { registerUser } from "../capability-1-user-auth/registerUser";
import { authenticateUser } from "../capability-1-user-auth/authenticateUser";

import {
  InMemoryUserStore,
  InMemoryAuthenticationStore,
} from "../capability-1-user-auth/inMemoryStores";

describe("Phase 2 — Cross-Capability Replay Isolation", () => {
  test("replayed authentication request is rejected without state mutation", () => {
    // -----------------------
    // Arrange (Deterministic)
    // -----------------------

    const now = new Date("2025-01-01T00:00:00.000Z");

    /**
     * ID consumption:
     * registerUser → 2 IDs
     * authenticateUser → 1 ID
     * replay authenticateUser → consumes same replay identity
     */
    const idGenerator = new DeterministicIdGenerator([
      "user-id-1",
      "auth-secret-1",
      "auth-proof-1",
    ]);

    const userStore = new InMemoryUserStore();
    const authenticationStore = new InMemoryAuthenticationStore();

    // -----------------------
    // Act — First execution
    // -----------------------

    const { userId, authenticationSecret } = registerUser(
      { now },
      userStore,
      idGenerator
    );

    authenticateUser(
      {
        userId,
        authenticationSecret,
        now,
      },
      userStore,
      authenticationStore,
      idGenerator
    );

    const authenticationCountAfterFirst =
      authenticationStore.getAll().length;

    // -----------------------
    // Act — Replay execution
    // -----------------------

    let replayError: unknown;

    try {
      authenticateUser(
        {
          userId,
          authenticationSecret,
          now,
        },
        userStore,
        authenticationStore,
        idGenerator
      );
    } catch (err) {
      replayError = err;
    }

    // -----------------------
    // Assert — Governance
    // -----------------------

    expect(replayError).toBeInstanceOf(ReplayRequestDetectedError);

    // -----------------------
    // Assert — No mutation
    // -----------------------

    const authenticationCountAfterReplay =
      authenticationStore.getAll().length;

    expect(authenticationCountAfterReplay).toBe(
      authenticationCountAfterFirst
    );
  });
});
