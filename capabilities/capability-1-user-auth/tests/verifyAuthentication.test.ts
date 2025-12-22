// capabilities/capability-1-user-auth/tests/verifyAuthentication.test.ts

import { verifyAuthentication } from "../verifyAuthentication";
import {
  AuthenticationProof,
  AuthenticationProofId,
} from "../types";
import { AuthenticationStore } from "../stores";
import { InvalidAuthenticationError } from "../errors";

const NOW = new Date("2024-01-01T00:00:00.000Z");

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

describe("verifyAuthentication", () => {
  test("Successful verification of authentication proof — Verifiable authentication proof", () => {
    const authenticationStore = new TestAuthenticationStore();

    const proof: AuthenticationProof = {
      proofId: "proof-1" as AuthenticationProofId,
      userId: "user-1",
      issuedAt: NOW,
    };

    authenticationStore.save(proof);

    const result = verifyAuthentication(
      proof.proofId,
      authenticationStore
    );

    expect(result).toEqual(proof);
  });

  test("Verification fails for unknown proof — No implicit authentication", () => {
    const authenticationStore = new TestAuthenticationStore();

    expect(() =>
      verifyAuthentication(
        "missing-proof" as AuthenticationProofId,
        authenticationStore
      )
    ).toThrow(InvalidAuthenticationError);
  });
});
