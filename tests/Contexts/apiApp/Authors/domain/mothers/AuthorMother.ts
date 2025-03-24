import { AuthorCreatorRequest } from '../../../../../../src/Contexts/apiApp/Authors/application/interfaces';
import {
  Author,
  AuthorName
} from '../../../../../../src/Contexts/apiApp/Authors/domain';
import { Metadata } from '../../../../../../src/Contexts/shared/domain/valueObject/Metadata';
import { Uuid } from '../../../../../../src/Contexts/shared/domain/valueObject/Uuid';
import { UserMother } from '../../../Auth/domain/mothers';
import { AuthorNameMother } from './AuthorNameMother';

const user = UserMother.random().username.value;
const metadata = new Metadata({
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: user,
  updatedBy: user
});

export class AuthorMother {
  static create(id: Uuid, name: AuthorName) {
    return new Author({ id, name, metadata });
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
