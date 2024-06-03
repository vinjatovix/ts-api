import { AuthorCreatorRequest } from '../../../../../../src/Contexts/apiApp/Authors/application';
import { AuthorName } from '../../../../../../src/Contexts/apiApp/Authors/domain';
import { Uuid } from '../../../../../../src/Contexts/shared/domain/valueObject/Uuid';
import { UuidMother } from '../../../../fixtures/shared/domain/mothers/UuidMother';
import { AuthorNameMother } from '../../domain/mothers/AuthorNameMother';

export class AuthorCreatorRequestMother {
  static create(id: Uuid, name: AuthorName) {
    return {
      id: id.value,
      name: name.value
    };
  }

  static random(id?: string): AuthorCreatorRequest {
    return this.create(
      id ? UuidMother.create(id) : UuidMother.random(),
      AuthorNameMother.random()
    );
  }

  static invalidValue(keys: string[]): AuthorCreatorRequest {
    const id = keys.includes('id')
      ? UuidMother.invalidValue()
      : UuidMother.random().value;
    const name = keys.includes('name')
      ? (AuthorNameMother.invalidValue() as string)
      : AuthorNameMother.random().value;

    return {
      id,
      name
    };
  }

  static inexistentId(): AuthorCreatorRequest {
    return {
      id: 'not-found',
      name: AuthorNameMother.random().value
    };
  }
}
