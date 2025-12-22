// capabilities/capability-1-user-auth/types.ts

export type UserId = string;
export type AuthenticationSecret = string;
export type AuthenticationProofId = string;

export interface User {
  userId: UserId;
  createdAt: Date;
  authenticationSecret: AuthenticationSecret;
}

export interface AuthenticationProof {
  proofId: AuthenticationProofId;
  userId: UserId;
  issuedAt: Date;
}
