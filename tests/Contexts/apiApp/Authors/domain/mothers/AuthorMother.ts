import { AuthorCreatorRequest } from '../../../../../../src/Contexts/apiApp/Authors/application';
import {
  Author,
  AuthorName
} from '../../../../../../src/Contexts/apiApp/Authors/domain';
import { Uuid } from '../../../../../../src/Contexts/shared/domain/valueObject/Uuid';
import { AuthorNameMother } from './AuthorNameMother';

export class AuthorMother {
  static create(id: Uuid, name: AuthorName) {
    return new Author({ id, name });
  }

  static from(command: AuthorCreatorRequest): Author {
    return this.create(new Uuid(command.id), new AuthorName(command.name));
  }

  static random(id?: string): Author {
    return this.create(
      id ? new Uuid(id) : Uuid.random(),
      AuthorNameMother.random()
    );
  }

  static randomList(length: number): Author[] {
    const list: Author[] = [];
    for (let i = 0; i < length; i++) {
      list.push(this.random());
    }

    return list;
  }
}
