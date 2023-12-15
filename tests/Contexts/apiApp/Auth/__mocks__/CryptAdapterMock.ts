import { CryptAdapter } from '../../../../../src/Contexts/shared/plugins/CryptAdapter';
import { Nullable } from '../../../../../src/Contexts/shared/domain/Nullable';
import { random } from '../../../fixtures/shared';
import { EmailMother } from '../../../shared/domain/mothers/EmailMother';

export class CryptAdapterMock implements CryptAdapter {
  private hashMock: jest.Mock;
  private compareMock: jest.Mock;
  private generateTokenMock: jest.Mock;
  private verifyTokenMock: jest.Mock;
  private refreshTokenMock: jest.Mock;

  constructor(
    { login, token }: { login?: boolean; token?: boolean } = {
      login: false,
      token: false
    }
  ) {
    this.hashMock = jest.fn().mockReturnValue('encryptedPassword');
    this.compareMock = jest.fn().mockReturnValue(login);
    this.generateTokenMock = jest.fn().mockReturnValue(random.word());
    this.verifyTokenMock = token
      ? jest.fn().mockReturnValue({ email: EmailMother.random().value })
      : jest.fn().mockReturnValue(null);
    this.refreshTokenMock = jest.fn().mockReturnValue(random.word());
  }

  hash(password: string): string {
    return this.hashMock(password);
  }

  assertHashHasBeenCalledWith(expected: string): void {
    expect(this.hashMock).toHaveBeenCalledWith(expected);
  }

  compare(value: string, encryptedValue: string): boolean {
    return this.compareMock(value, encryptedValue);
  }

  assertCompareHasBeenCalledWith(
    expectedValue: string,
    expectedEncryptedValue: string
  ): void {
    expect(this.compareMock).toHaveBeenCalledWith(
      expectedValue,
      expectedEncryptedValue
    );
  }

  generateToken(
    payload: Record<string, unknown>,
    duration?: string
  ): Promise<Nullable<string>> {
    return this.generateTokenMock(payload, duration);
  }
  verifyToken(token: string): Promise<Nullable<Record<string, unknown>>> {
    return this.verifyTokenMock(token);
  }

  assertVerifyTokenHasBeenCalledWith(expected: string): void {
    expect(this.verifyTokenMock).toHaveBeenCalledWith(expected);
  }

  refreshToken(token: string): Promise<Nullable<string>> {
    return this.refreshTokenMock(token);
  }

  assertRefreshTokenHasBeenCalledWith(expected: string): void {
    expect(this.refreshTokenMock).toHaveBeenCalledWith(expected);
  }
}
