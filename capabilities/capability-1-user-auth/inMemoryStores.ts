// capabilities/capability-1-user-auth/inMemoryStores.ts

import {
  UserStore,
  AuthenticationStore,
} from "./stores";
import {
  User,
  UserId,
  AuthenticationProof,
  AuthenticationProofId,
} from "./types";

export class InMemoryUserStore implements UserStore {
  private readonly users = new Map<UserId, User>();

  getById(userId: UserId): User | undefined {
    return this.users.get(userId);
  }

  create(user: User): void {
    this.users.set(user.userId, user);
  }
}

export class InMemoryAuthenticationStore
  implements AuthenticationStore
{
  private readonly proofs = new Map<
    AuthenticationProofId,
    AuthenticationProof
  >();

  getByProofId(
    proofId: AuthenticationProofId
  ): AuthenticationProof | undefined {
    return this.proofs.get(proofId);
  }

  save(proof: AuthenticationProof): void {
    this.proofs.set(proof.proofId, proof);
  }
}
