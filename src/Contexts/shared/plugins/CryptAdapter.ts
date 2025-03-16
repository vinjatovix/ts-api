import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { EncrypterTool } from './EncrypterTool';
import { sign, verify } from 'jsonwebtoken';
import { envs } from '../../../config/plugins';
import { Nullable } from '../domain/types';

const JWT_SECRET = envs.JWT_SECRET;
const SALT_ROUNDS = 12;

export class CryptAdapter implements EncrypterTool {
  hash(password: string): string {
    const salt = genSaltSync(SALT_ROUNDS);
    return hashSync(password, salt);
  }

  compare(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }

  async generateToken(
    payload: Record<string, unknown>,
    duration: string = '2h'
  ): Promise<Nullable<string>> {
    return new Promise((resolve) => {
      sign(payload, JWT_SECRET, { expiresIn: duration }, (err, token) =>
        err ? resolve(null) : resolve(token as string)
      );
    });
  }

  async verifyToken(token: string): Promise<Nullable<Record<string, unknown>>> {
    return new Promise((resolve) => {
      verify(token, JWT_SECRET, (err, decoded) =>
        err ? resolve(null) : resolve(decoded as Record<string, unknown>)
      );
    });
  }

  async refreshToken(token: string): Promise<Nullable<string>> {
    const decoded = await this.verifyToken(token);
    if (!decoded) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    const { exp, ...payload } = decoded as { exp: number; iat: number };

    return exp > now ? this.generateToken(payload) : null;
  }
}
