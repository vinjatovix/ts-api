import { RegisterUserRequest } from '../../../../../../src/Contexts/apiApp/Auth/application/interfaces';
import { Username } from '../../../../../../src/Contexts/apiApp/Auth/domain';
import {
  Email,
  StringValueObject,
  Uuid
} from '../../../../../../src/Contexts/shared/domain/valueObject';
import { random } from '../../../../fixtures/shared';
import { UuidMother } from '../../../../fixtures/shared/domain/mothers';
import { EmailMother } from '../../../../shared/domain/mothers/EmailMother';

export class RegisterUserRequestMother {
  static create(
    id: Uuid,
    email: Email,
    username: Username,
    password: StringValueObject
  ): RegisterUserRequest {
    return {
      id: id.value,
      email: email.value,
      username: username.value,
      password: password.value
    };
  }

  static random(id?: string): RegisterUserRequest {
    return this.create(
      (id && UuidMother.create(id)) || UuidMother.random(),
      EmailMother.random(),
      new Username(
        random.word({ min: Username.MIN_LENGTH, max: Username.MAX_LENGTH })
      ),
      new StringValueObject('%aD3f3s.0%')
    );
  }
}
