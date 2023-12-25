import { CryptAdapter } from '../../../../src/Contexts/shared/plugins/CryptAdapter';
import { random } from '../../fixtures/shared';

describe('CryptAdapter', () => {
  const cryptAdapter = new CryptAdapter();

  describe('hash', () => {
    it('should return a hash', () => {
      const password = random.word();

      const hash = cryptAdapter.hash(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
    });
  });

  describe('compare', () => {
    it('should return true if password and hash match', () => {
      const password = random.word();
      const hash = cryptAdapter.hash(password);

      expect(cryptAdapter.compare(password, hash)).toBe(true);
    });

    it('should return false if password and hash do not match', () => {
      const password = random.word();
      const unMatchedPassword = random.word();
      const hash = cryptAdapter.hash(password);

      expect(cryptAdapter.compare(unMatchedPassword, hash)).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should return a token with default duration', async () => {
      const payload = { id: random.uuid() };
      const token = await cryptAdapter.generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should return a token with custom duration', async () => {
      const payload = { id: random.uuid() };
      const duration = '1h';

      const token = await cryptAdapter.generateToken(payload, duration);

      expect(token).toBeDefined();
    });
  });

  describe('verifyToken', () => {
    it('should return a payload', async () => {
      const seed = { id: random.uuid() };
      const token = await cryptAdapter.generateToken(seed);

      const payload = await cryptAdapter.verifyToken(token as string);

      expect(payload).toMatchObject(seed);
    });

    it('should return null if token is invalid', async () => {
      const payload = await cryptAdapter.verifyToken(random.word());

      expect(payload).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should return a new token', async () => {
      const seed = { id: random.uuid() };
      const duration = '12h';
      const token = await cryptAdapter.generateToken(seed, duration);

      const newToken = await cryptAdapter.refreshToken(token as string);

      expect(newToken).toBeDefined();
      expect(newToken).not.toBe(token);
    });

    it('should return null if token has expired', async () => {
      const seed = { id: random.uuid() };
      const duration = '0s';
      const token = await cryptAdapter.generateToken(seed, duration);

      const newToken = await cryptAdapter.refreshToken(token as string);

      expect(newToken).toBeNull();
    });
  });
});
