export interface JwtPayload {
  sub: string; // User ID
  email: string;
  username?: string;
  role?: string;
  iat?: number;
  exp?: number;
}
