// capabilities/capability-1-user-auth/errors.ts

export class UserNotFoundError extends Error {}
export class InvalidAuthenticationError extends Error {}
export class AuthenticationReplayError extends Error {}
