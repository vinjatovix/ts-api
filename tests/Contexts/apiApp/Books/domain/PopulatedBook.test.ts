import { PopulatedBook } from '../../../../../src/Contexts/apiApp/Books/domain';
import { Metadata } from '../../../../../src/Contexts/shared/domain/valueObject/Metadata';
import { UuidMother } from '../../../fixtures/shared/domain/mothers/UuidMother';
import { UserMother } from '../../Auth/domain/mothers';
import { AuthorMother } from '../../Authors/domain/mothers/AuthorMother';
import {
  BookPagesMother,
  BookReleaseDateMother,
  BookTitleMother,
  ISBNMother
} from './mothers';

const user = UserMother.random().username.value;
const populatedBookValueObjects = {
  id: UuidMother.random(),
  title: BookTitleMother.random(),
  isbn: ISBNMother.random(),
  releaseDate: BookReleaseDateMother.random(),
  pages: BookPagesMother.random(),
  metadata: new Metadata({
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: user,
    updatedBy: user
  }),
  author: AuthorMother.random()
};

describe('PopulatedBook', () => {
  it('should create a valid populated book', () => {
    expect(new PopulatedBook(populatedBookValueObjects)).toMatchObject(
      populatedBookValueObjects
    );
  });

  it('should return primitives from populated book', () => {
    const populatedBook = new PopulatedBook(populatedBookValueObjects);

    const primitives = populatedBook.toPrimitives();

    expect(primitives).toMatchObject({
      id: populatedBookValueObjects.id.value,
      title: populatedBookValueObjects.title.value,
      isbn: populatedBookValueObjects.isbn.value,
      releaseDate: populatedBookValueObjects.releaseDate.value.toISOString(),
      pages: populatedBookValueObjects.pages.value,
      metadata: populatedBookValueObjects.metadata.toPrimitives(),
      author: populatedBookValueObjects.author.toPrimitives()
    });
  });
});
