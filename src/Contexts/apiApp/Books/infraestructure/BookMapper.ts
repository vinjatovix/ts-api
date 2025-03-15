import { Metadata } from '../../../shared/domain/valueObject';
import { BaseMapper } from '../../shared/infraestructure/persistence/BaseMapper';
import { Book, PopulatedBook } from '../domain';
import { BookPrimitives } from '../domain/interfaces';
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
    if (!_id) {
      throw new Error('Missing _id in BookType');
    }
    return Book.fromPrimitives({
      id: _id,
      title,
      author,
      isbn,
      releaseDate:
        releaseDate instanceof Date ? releaseDate.toISOString() : releaseDate,
      pages,
      metadata
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
    if (!_id) {
      throw new Error('Missing _id in PopulatedBookType');
    }

    return PopulatedBook.fromPrimitives({
      id: _id,
      title,
      author: BaseMapper.mapNestedId(author),
      isbn,
      releaseDate: releaseDate as string,
      pages,
      metadata: Metadata.fromPrimitives(metadata)
    });
  }

  static map(
    book:
      | PopulatedBookType
      | BookType
      | string
      | null
      | undefined
      | BookPrimitives
  ) {
    if (!book) {
      return null;
    }

    if (typeof book === 'string') {
      return book;
    }

    if (this.isPopulatedType(book as PopulatedBookType)) {
      return this.toPopulatedDomain(book as PopulatedBookType);
    }

    if (this.isPopulatedPrimitives(book as BookPrimitives)) {
      return PopulatedBook.fromPrimitives(book as BookPrimitives);
    }

    return this.toDomain(book as BookType);
  }

  static isPopulatedType(
    document: BookType | PopulatedBookType
  ): document is PopulatedBookType {
    return typeof document.author === 'object' && '_id' in document.author;
  }

  static isPopulatedPrimitives(
    document: BookPrimitives | null | undefined
  ): boolean {
    return (
      typeof document !== 'string' &&
      typeof document?.author !== 'string' &&
      !!document?.author?.id
    );
  }
}
