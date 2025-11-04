export interface ITokenCacheRepo {

  setAccessToken(userId: string, token: string, expiresIn: number): Promise<void>;
  getAccessToken(userId: string): Promise<string | null>;
  deleteAccessToken(userId: string): Promise<void>;
  
  setRefreshToken(userId: string, token: string, expiresIn: number): Promise<void>;
  getRefreshToken(userId: string): Promise<string | null>;
  deleteRefreshToken(userId: string): Promise<void>;
  
  setVerificationToken(email: string, token: string, expiresIn: number): Promise<void>;
  getVerificationToken(token: string): Promise<string | null>;
  deleteVerificationToken(token: string): Promise<void>;
  
  clearUserTokens(userId: string): Promise<void>;
}