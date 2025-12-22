// capabilities/capability-1-user-auth/stores.ts

import {
  User,
  UserId,
  AuthenticationProof,
  AuthenticationProofId
} from "./types";

export interface UserStore {
  getById(userId: UserId): User | undefined;
  create(user: User): void;
}

export interface AuthenticationStore {
  getByProofId(
    proofId: AuthenticationProofId
  ): AuthenticationProof | undefined;

  save(proof: AuthenticationProof): void;
}
