import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain/Username';
import { random } from '../../../fixtures/shared';

describe('UserName', () => {
  it('should throw an error if user username is more than 20 chars long', () => {
    const invalidUsername = random.word({ min: 21, max: 255 });
    expect(() => new Username(invalidUsername)).toThrow(
      '<Username> must be less than 20 characters long'
    );
  });

  it('should throw an error if user username is less than 4 chars long', () => {
    const invalidUsername = random.word({ min: 1, max: 3 });
    expect(() => new Username(invalidUsername)).toThrow(
      '<Username> must be at least 4 characters long'
    );
  });
});
