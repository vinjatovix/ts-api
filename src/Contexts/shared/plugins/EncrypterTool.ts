import { Nullable } from '../domain/types';

export interface EncrypterTool {
  hash(value: string): string;
  compare(value: string, encryptedValue: string): boolean;
  generateToken(payload: Record<string, unknown>): Promise<Nullable<string>>;
  verifyToken(token: string): Promise<Nullable<Record<string, unknown>>>;
  refreshToken(token: string): Promise<Nullable<string>>;
}
