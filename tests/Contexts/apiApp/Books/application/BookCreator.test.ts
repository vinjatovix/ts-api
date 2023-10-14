import { BookCreator } from '../../../../../src/Contexts/apiApp/Books/application/BookCreator';
import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';
import { BookAuthor } from '../../../../../src/Contexts/apiApp/Books/domain/BookAuthor';
import { BookTitle } from '../../../../../src/Contexts/apiApp/Books/domain/BookTitle';
import { ISBN } from '../../../../../src/Contexts/apiApp/Books/domain/ISBN';
import { Uuid } from '../../../../../src/Contexts/shared/domain/value-object/Uuid';
import { random } from '../../../fixtures/shared';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';

const ID = random.uuid();
const TITLE = random.word();
const AUTHOR = random.word();
const ISBN_CODE = random.isbn();
const RELEASE_DATE = random.date().toISOString();
const PAGES = random.integer();

describe('BookCreator', () => {
  let repository: BookRepositoryMock;
  let creator: BookCreator;

  beforeEach(() => {
    repository = new BookRepositoryMock();
    creator = new BookCreator(repository);
  });

  it('should create a valid book', async () => {
    const book = new Book({
      id: new Uuid(ID),
      title: new BookTitle(TITLE),
      author: new BookAuthor(AUTHOR),
      isbn: new ISBN(ISBN_CODE),
      releaseDate: RELEASE_DATE,
      pages: PAGES
    });

    await creator.run({
      id: ID,
      title: TITLE,
      author: AUTHOR,
      isbn: ISBN_CODE,
      releaseDate: RELEASE_DATE,
      pages: PAGES
    });

    repository.assertSaveHasBeenCalledWith(book);
  });

  it('should throw an error when the book title length is greater than 100 characters', async () => {
    const title = random.word(101);

    expect(() => {
      const book = new Book({
        id: new Uuid(ID),
        title: new BookTitle(title),
        author: new BookAuthor(AUTHOR),
        isbn: new ISBN(ISBN_CODE),
        releaseDate: RELEASE_DATE,
        pages: PAGES
      });

      creator.run({
        id: ID,
        title,
        author: AUTHOR,
        isbn: ISBN_CODE,
        releaseDate: RELEASE_DATE,
        pages: PAGES
      });

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrowError(`<BookTitle> <${title}> has more than 100 characters`);
  });

  it('should throw an error when the book author length is greater than 40 characters', async () => {
    const author = random.word(41);

    expect(() => {
      const book = new Book({
        id: new Uuid(ID),
        title: new BookTitle(TITLE),
        author: new BookAuthor(author),
        isbn: new ISBN(ISBN_CODE),
        releaseDate: RELEASE_DATE,
        pages: PAGES
      });

      creator.run({
        id: ID,
        title: TITLE,
        author,
        isbn: ISBN_CODE,
        releaseDate: RELEASE_DATE,
        pages: PAGES
      });

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrowError(`<BookAuthor> <${author}> has more than 40 characters`);
  });

  it('should throw an error when the book isbn length is greater than 13 characters', async () => {
    const isbn = '978-3-16-1484100-0';

    expect(() => {
      const book = new Book({
        id: new Uuid(ID),
        title: new BookTitle(TITLE),
        author: new BookAuthor(AUTHOR),
        isbn: new ISBN(isbn),
        releaseDate: RELEASE_DATE,
        pages: PAGES
      });

      creator.run({
        id: ID,
        title: TITLE,
        author: AUTHOR,
        isbn,
        releaseDate: RELEASE_DATE,
        pages: PAGES
      });

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrowError(`<ISBN> <${isbn}> has more than 13 characters`);
  });

  it('should throw an error when the book isbn is not valid', async () => {
    const isbn = 'AAA-3-16-1484100-1';

    expect(() => {
      const book = new Book({
        id: new Uuid(ID),
        title: new BookTitle(TITLE),
        author: new BookAuthor(AUTHOR),
        isbn: new ISBN(isbn),
        releaseDate: RELEASE_DATE,
        pages: PAGES
      });

      creator.run({
        id: ID,
        title: TITLE,
        author: AUTHOR,
        isbn,
        releaseDate: RELEASE_DATE,
        pages: PAGES
      });

      repository.assertSaveHasBeenCalledWith(book);
    }).toThrowError(`<ISBN> <${isbn}> is not a valid ISBN`);
  });
});
