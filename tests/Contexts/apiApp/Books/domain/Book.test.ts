import { Book } from '../../../../../src/Contexts/apiApp/Books/domain/Book';
import { BookAuthor } from '../../../../../src/Contexts/apiApp/Books/domain/BookAuthor';
import { BookId } from '../../../../../src/Contexts/apiApp/Books/domain/BookId';
import { BookPages } from '../../../../../src/Contexts/apiApp/Books/domain/BookPages';
import { BookReleaseDate } from '../../../../../src/Contexts/apiApp/Books/domain/BookReleaseDate';
import { BookTitle } from '../../../../../src/Contexts/apiApp/Books/domain/BookTitle';
import { Isbn } from '../../../../../src/Contexts/apiApp/Books/domain/ISBN';
import { InvalidArgumentError } from '../../../../../src/Contexts/shared/domain/value-object/InvalidArgumentError';
import { random } from '../../../fixtures/shared';
import { BookAuthorMother } from './BookAuthorMother';
import { BookIdMother } from './BookIdMother';
import { BookPagesMother } from './BookPagesMother';
import { BookReleaseDateMother } from './BookReleaseDateMother';
import { BookTitleMother } from './BookTitleMother';
import { ISBNMother } from './ISBNMother';

const BOOK_ID = BookIdMother.random();
const TITLE = BookTitleMother.random();
const AUTHOR = BookAuthorMother.random();
const RELEASE_DATE = BookReleaseDateMother.random();
const ISBN = ISBNMother.random();
const PAGES = BookPagesMother.random();

const BOOK_VALUES = {
  id: BOOK_ID,
  title: TITLE,
  author: AUTHOR,
  releaseDate: RELEASE_DATE,
  isbn: ISBN,
  pages: PAGES
};

describe('Book', () => {
  it('should create a valid book', () => {
    expect(new Book(BOOK_VALUES)).toMatchObject({
      id: BOOK_ID,
      title: TITLE,
      author: AUTHOR,
      releaseDate: RELEASE_DATE,
      isbn: ISBN,
      pages: PAGES
    });
  });

  describe('Book Id', () => {
    it('should throw an error when the id is not a valid uuid', () => {
      let id;
      expect(() => {
        id = new BookId(BookIdMother.invalidValue());
      }).toThrowError(InvalidArgumentError);

      expect(id).toBeUndefined();
    });
  });

  describe('Book Title', () => {
    it("should throw an error when the title isn't a valid string", () => {
      let title;
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        title = new BookTitle(BookTitleMother.invalidValue());
      }).toThrowError(InvalidArgumentError);

      expect(title).toBeUndefined();
    });

    it('should throw an error when the title is longer than 100 characters', () => {
      let title;
      expect(() => {
        title = new BookTitle(random.word({ min: 101 }));
      }).toThrowError(InvalidArgumentError);

      expect(title).toBeUndefined();
    });

    it('should throw an error when the title is lower to 1 character', () => {
      let title;
      expect(() => {
        title = new BookTitle('');
      }).toThrowError(InvalidArgumentError);

      expect(title).toBeUndefined();
    });

    it('should throw an error when the title is undefined or null', () => {
      let title;
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        title = new BookTitle(null);
      }).toThrowError(InvalidArgumentError);

      expect(title).toBeUndefined();
    });
  });

  describe('Book Author', () => {
    it("should throw an error when the author isn't a string", () => {
      let author;
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        author = new BookAuthor(123);
      }).toThrowError(InvalidArgumentError);

      expect(author).toBeUndefined();
    });

    it('should throw an error when the author is longer than 40 characters', () => {
      let author;
      expect(() => {
        author = new BookAuthor(BookAuthorMother.invalidValue());
      }).toThrowError(InvalidArgumentError);

      expect(author).toBeUndefined();
    });

    it('should throw an error when the author is empty', () => {
      let author;
      expect(() => {
        author = new BookAuthor('');
      }).toThrowError(InvalidArgumentError);

      expect(author).toBeUndefined();
    });
  });

  describe('Book Release Date', () => {
    it('should throw an error when the release date is not a valid date', () => {
      let releaseDate;
      expect(() => {
        releaseDate = new BookReleaseDate('invalid-date');
      }).toThrowError(InvalidArgumentError);

      expect(releaseDate).toBeUndefined();
    });
  });

  describe('Book ISBN', () => {
    it('should throw an error when the isbn is not a valid isbn', () => {
      let isbn;
      expect(() => {
        isbn = new Isbn('invalid-isbn');
      }).toThrowError(InvalidArgumentError);

      expect(isbn).toBeUndefined();
    });

    it('should throw an error when the isbn is empty', () => {
      let isbn;
      expect(() => {
        isbn = new Isbn('');
      }).toThrowError(InvalidArgumentError);

      expect(isbn).toBeUndefined();
    });
  });

  describe('Book Pages', () => {
    it('should throw an error when the pages is not a valid type', () => {
      let pages;
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        pages = new BookPages(BookPagesMother.invalidType());
      }).toThrowError(InvalidArgumentError);

      expect(pages).toBeUndefined();
    });

    it('should throw an error when the pages is less than 1', () => {
      let pages;
      expect(() => {
        pages = new BookPages(BookPagesMother.invalidValue());
      }).toThrowError(InvalidArgumentError);

      expect(pages).toBeUndefined();
    });
  });
});
