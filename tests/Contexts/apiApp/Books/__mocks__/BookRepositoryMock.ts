import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';
import { BookByQuery } from '../../../../../src/Contexts/apiApp/Books/application/interfaces';
import {
  Book,
  BookPatch
} from '../../../../../src/Contexts/apiApp/Books/domain';
import { BookRepository } from '../../../../../src/Contexts/apiApp/Books/domain/interfaces';
import { BaseRepositoryMock } from '../../shared/__mocks__/BaseRepositoryMock';
import { BookMother } from '../domain/mothers';

export class BookRepositoryMock
  extends BaseRepositoryMock<Book, BookPatch, BookByQuery>
  implements BookRepository
{
  constructor({ find = false }: { find?: boolean } = { find: false }) {
    super({ find }, [BookMother.random()]);
  }

  protected getId(book: Book): string {
    return book.id.value;
  }

  protected defaultFindByQuery(query: BookByQuery): Book[] {
    const foundBooks = this.storage.filter((book: Book) => {
      return query.author && book.author?.value === query.author;
    });

    return this.isFindable && !foundBooks.length ? this.storage : foundBooks;
  }

  async save(book: Book): Promise<void> {
    this.saveMock(book);
  }

  async update(book: BookPatch, username: Username): Promise<void> {
    this.updateMock(book, username);
  }

  async search(id: string): Promise<Book | null> {
    return this.findMock(id);
  }
}
