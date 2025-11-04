export interface ITokenCacheService {
  // Access Tokens
  storeAccessToken(userId: string, token: string): Promise<void>;
  storeRefreshToken(userId: string, token: string): Promise<void>;
  storeVerificationToken(email: string, token: string): Promise<void>;

  // Refresh Tokens
  validateAccessToken(userId: string, token: string): Promise<boolean>;
  validateRefreshToken(userId: string, token: string): Promise<boolean>;
  validateVerificationToken(token: string): Promise<{valid: boolean, email: string}>;
  getAccessToken(userId: string): Promise<string | null>;
  getRefreshToken(userId: string): Promise<string | null>;

  revokeAccessToken(userId: string): Promise<void>;
  revokeRefreshToken(userId: string): Promise<void>;

  isUserSessionActive(userId: string): Promise<boolean>;
}
