import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';
import {
  Author,
  AuthorPatch
} from '../../../../../src/Contexts/apiApp/Authors/domain';
import { AuthorRepository } from '../../../../../src/Contexts/apiApp/Authors/domain/interfaces';
import { BaseRepositoryMock } from '../../shared/__mocks__/BaseRepositoryMock';
import { AuthorMother } from '../domain/mothers';

export class AuthorRepositoryMock
  extends BaseRepositoryMock<Author, AuthorPatch, { id: string }>
  implements AuthorRepository
{
  protected defaultFindByQuery(query: { id: string }): Author[] {
    return this.storage.filter((author) => author.id.value === query.id);
  }

  constructor({ find }: { find: boolean } = { find: false }) {
    super({ find }, [AuthorMother.random()]);
  }

  protected getId(author: Author): string {
    return author.id.value;
  }

  async save(author: Author): Promise<void> {
    this.saveMock(author);
  }

  async update(author: AuthorPatch, user: Username): Promise<void> {
    this.updateMock(author, user);
  }

  async search(authorId: string): Promise<Author | null> {
    return this.findMock(authorId);
  }
}
