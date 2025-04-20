import { createError } from '../../../shared/domain/errors';
import { EncrypterTool } from '../../../shared/plugins';

export class RefreshToken {
  constructor(private readonly encrypter: EncrypterTool) {}

  async run(token: string): Promise<string> {
    const newToken = await this.encrypter.refreshToken(token);
    if (!newToken) {
      throw createError.auth('Invalid token');
    }

    return newToken;
  }
}
