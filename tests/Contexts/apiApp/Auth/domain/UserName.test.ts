import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';
import { random } from '../../../fixtures/shared';

describe('UserName', () => {
  it('should throw an error if user username is more than 20 chars long', () => {
    const invalidUsername = random.word({ min: Username.MAX_LENGTH + 1 });
    expect(() => new Username(invalidUsername)).toThrow(
      `<Username> <${invalidUsername}> has more than ${Username.MAX_LENGTH} characters`
    );
  });

  it('should throw an error if user username is less than 4 chars long', () => {
    const invalidUsername = random.word({
      min: 1,
      max: Username.MIN_LENGTH - 1
    });
    expect(() => new Username(invalidUsername)).toThrow(
      `<Username> <${invalidUsername}> has less than ${Username.MIN_LENGTH} characters`
    );
  });
});
