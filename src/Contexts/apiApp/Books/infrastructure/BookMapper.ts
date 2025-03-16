import {
  BaseEntityMapper,
  BaseMapper
} from '../../../shared/infrastructure/persistence/mongo';
import { Book, PopulatedBook } from '../domain';
import { BookPrimitives } from '../domain/interfaces';
import { BookType, PopulatedBookType } from './types';

export class BookMapper extends BaseEntityMapper<
  Book,
  PopulatedBook,
  BookType,
  PopulatedBookType,
  BookPrimitives
> {
  toDomain(document: BookType): Book {
    const primitives = BaseMapper.mapNestedId(
      document
    ) as unknown as BookPrimitives;

    return Book.fromPrimitives(primitives);
  }

  toPopulatedDomain(document: PopulatedBookType): PopulatedBook {
    const primitives = BaseMapper.mapNestedId(
      document
    ) as unknown as BookPrimitives;

    return PopulatedBook.fromPrimitives(primitives);
  }

  isPopulatedType(
    document: BookType | PopulatedBookType
  ): document is PopulatedBookType {
    return typeof document.author === 'object' && '_id' in document.author;
  }

  isPopulatedPrimitives(document: BookPrimitives): document is BookPrimitives {
    return typeof document.author === 'object' && 'id' in document.author;
  }
}
