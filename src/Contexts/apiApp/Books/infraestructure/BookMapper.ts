import { Metadata } from '../../../shared/domain/valueObject';
import { Book, PopulatedBook } from '../domain';
import { BookType, PopulatedBookType } from './types';

export class BookMapper {
  static toDomain({
    _id,
    title,
    author,
    isbn,
    releaseDate,
    pages,
    metadata
  }: BookType) {
    return Book.fromPrimitives({
      id: _id,
      title: title,
      author: author,
      isbn: isbn,
      releaseDate:
        releaseDate instanceof Date ? releaseDate.toISOString() : releaseDate,
      pages: pages,
      metadata: metadata
    });
  }

  static toPopulatedDomain({
    _id,
    title,
    author,
    isbn,
    pages,
    releaseDate,
    metadata
  }: PopulatedBookType) {
    return PopulatedBook.fromPrimitives({
      id: _id,
      title,
      ...(author && {
        author: {
          id: author._id,
          name: author.name,
          metadata: author.metadata
        }
      }),
      isbn,
      releaseDate: releaseDate as string | undefined,
      pages: pages,
      metadata: Metadata.fromPrimitives(metadata)
    });
  }

  static map(book: PopulatedBookType | BookType | string | null | undefined) {
    if (!book) {
      return null;
    }

    if (typeof book === 'string') {
      return book;
    }

    if (
      typeof book === 'object' &&
      book !== null &&
      'author' in book &&
      typeof book.author === 'object' &&
      '_id' in book.author
    ) {
      return this.toPopulatedDomain(book as PopulatedBookType);
    }

    return this.toDomain(book as BookType);
  }
}
