import { Email } from '../../../../src/Contexts/apiApp/Auth/domain';
import { random } from '../../fixtures/shared';
import { EmailMother } from './mothers/EmailMother';

describe('Email', () => {
  it('should create a valid email', () => {
    const email = EmailMother.random();
    expect(email).toBeInstanceOf(Email);
  });

  it('should throw an error if email is more than 255 chars long', () => {
    const invalidEmail = random.word({ min: 256, max: 512 });
    expect(() => EmailMother.create(invalidEmail)).toThrowError(
      '<Email> must be less than 255 characters long'
    );
  });

  it('should throw an error if email is less than 6 chars long', () => {
    const invalidEmail = random.word({ min: 1, max: 3 });
    expect(() => EmailMother.create(invalidEmail)).toThrowError(
      '<Email> must be at least 6 characters long'
    );
  });

  it('should throw an error if email is not an email address', () => {
    const invalidEmail = random.word({ min: 6, max: 255 });
    expect(() => EmailMother.create(invalidEmail)).toThrowError(
      `<Email> does not allow the value <${invalidEmail}>`
    );
  });

  it('should throw an error if email domain is in the blackList', () => {
    const invalidEmail = `test@${random.arrayElement([
      'mailinator.com',
      'guerrillamail.com',
      'sharklasers.com'
    ])}`;
    expect(() => EmailMother.create(invalidEmail)).toThrowError(
      `<Email> does not allow the domain <${invalidEmail}>`
    );
  });
});
