import { RegisterUserRequest } from '../../../../../../src/Contexts/apiApp/Auth/application/RegisterUserRequest';
import {
  Email,
  Username
} from '../../../../../../src/Contexts/apiApp/Auth/domain';
import { StringValueObject } from '../../../../../../src/Contexts/shared/domain/value-object/StringValueObject';
import { random } from '../../../../fixtures/shared';
import { EmailMother } from '../../../../shared/domain/mothers/EmailMother';

export class RegisterUserRequestMother {
  static create(
    email: Email,
    username: Username,
    password: StringValueObject
  ): RegisterUserRequest {
    return {
      email: email.value,
      username: username.value,
      password: password.value
    };
  }

  static random(): RegisterUserRequest {
    return this.create(
      EmailMother.random(),
      new Username(random.word({ min: 4, max: 20 })),
      new StringValueObject('%aD3f3s.0%')
    );
  }
}
