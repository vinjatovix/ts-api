import { LoginUserRequest } from '../../../../../../src/Contexts/apiApp/Auth/application/interfaces';
import {
  Email,
  StringValueObject
} from '../../../../../../src/Contexts/shared/domain/valueObject';
import { EmailMother } from '../../../../shared/domain/mothers';

export class LoginUserRequestMother {
  static create(email: Email, password: StringValueObject): LoginUserRequest {
    return {
      email: email.value,
      password: password.value
    };
  }

  static random(): LoginUserRequest {
    return this.create(
      EmailMother.random(),
      new StringValueObject('%aD3f3s.0%')
    );
  }
}
