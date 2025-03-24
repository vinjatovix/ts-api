import {
  Book,
  BookPages,
  BookReleaseDate,
  BookTitle,
  Isbn
} from '../../../../../src/Contexts/apiApp/Books/domain';
import { Uuid } from '../../../../../src/Contexts/shared/domain/valueObject';
import { Metadata } from '../../../../../src/Contexts/shared/domain/valueObject/Metadata';
import { random } from '../../../fixtures/shared';
import { UuidMother } from '../../../fixtures/shared/domain/mothers/UuidMother';
import { UserMother } from '../../Auth/domain/mothers';
import {
  BookPagesMother,
  BookReleaseDateMother,
  BookTitleMother,
  ISBNMother
} from './mothers';

const user = UserMother.random().username.value;

describe('Book', () => {
  it('should create a valid book', () => {
    const bookValueObjects = {
      id: UuidMother.random(),
      title: BookTitleMother.random(),
      author: UuidMother.random(),
      releaseDate: BookReleaseDateMother.random(),
      pages: BookPagesMother.random(),
      isbn: ISBNMother.random(),
      metadata: new Metadata({
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user,
        updatedBy: user
      })
    };

    expect(new Book(bookValueObjects)).toMatchObject(bookValueObjects);
  });

  describe('Book Id', () => {
    it('should throw an error when the id is not a valid uuid', () => {
      let id;
      expect(() => {
        id = new Uuid(UuidMother.invalidValue());
      }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

      expect(id).toBeUndefined();
    });
  });

  describe('Book Title', () => {
    it("should throw an error when the title isn't a valid string", () => {
      let title;
      expect(() => {
        // @ts-expect-error Testing purposes
        title = new BookTitle(BookTitleMother.invalidValue());
      }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

      expect(title).toBeUndefined();
    });

    it('should throw an error when the title is longer than 100 characters', () => {
      let title;
      expect(() => {
        title = new BookTitle(random.word({ min: BookTitle.MAX_LENGTH + 1 }));
      }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

      expect(title).toBeUndefined();
    });

    it('should throw an error when the title is lower to 1 character', () => {
      let title;
      expect(() => {
        title = new BookTitle('');
      }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

      expect(title).toBeUndefined();
    });

    it('should throw an error when the title is undefined or null', () => {
      let title;
      expect(() => {
        // @ts-expect-error Testing purposes
        title = new BookTitle(null);
      }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

      expect(title).toBeUndefined();
    });
  });

  describe('Book Author', () => {
    it("should throw an error when the author isn't a string", () => {
      let author;
      expect(() => {
        // @ts-expect-error Testing purposes
        author = new Uuid(123);
      }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

      expect(author).toBeUndefined();
    });

    it('should throw an error when the author is not a valid Uuid', () => {
      let author;
      expect(() => {
        author = new Uuid(UuidMother.invalidValue());
      }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

      expect(author).toBeUndefined();
    });

    it('should throw an error when the author is empty', () => {
      let author;
      expect(() => {
        author = new Uuid('');
      }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

      expect(author).toBeUndefined();
    });
  });

  describe('Book Release Date', () => {
    it('should throw an error when the release date is not a valid date', () => {
      let releaseDate;
      expect(() => {
        releaseDate = new BookReleaseDate('invalid-date');
      }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

      expect(releaseDate).toBeUndefined();
    });
  });

  describe('Book ISBN', () => {
    it('should throw an error when the isbn is not a valid isbn', () => {
      let isbn;
      expect(() => {
        isbn = new Isbn('invalid-isbn');
      }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

      expect(isbn).toBeUndefined();
    });

    it('should throw an error when the isbn is empty', () => {
      let isbn;
      expect(() => {
        isbn = new Isbn('');
      }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

      expect(isbn).toBeUndefined();
    });
  });

  describe('Book Pages', () => {
    it('should throw an error when the pages is not a valid type', () => {
      let pages;
      expect(() => {
        // @ts-expect-error Testing purposes
        pages = new BookPages(BookPagesMother.invalidType());
      }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

      expect(pages).toBeUndefined();
    });

    it('should throw an error when the pages is less than 1', () => {
      let pages;
      expect(() => {
        pages = new BookPages(BookPagesMother.invalidValue());
      }).toThrow(expect.objectContaining({ name: 'InvalidArgumentError' }));

      expect(pages).toBeUndefined();
    });
  });
});
