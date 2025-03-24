import { createError } from '../../../shared/domain/errors';
import { Nullable } from '../../../shared/domain/types';
import { Author } from '../../Authors/domain';
import { BookBase } from './BookBase';
import { BookPrimitives, PopulatedBookProps } from './interfaces';

export class PopulatedBook extends BookBase {
  readonly author: Nullable<Author>;

  constructor({ author, ...props }: PopulatedBookProps) {
    super(props);
    this.author = author || null;
  }

  toPrimitives(): BookPrimitives {
    return {
      ...super.toPrimitives(),
      ...(this.author && { author: this.author.toPrimitives() })
    };
  }

  static fromPrimitives({ author, ...primitives }: BookPrimitives) {
    if (!author || typeof author === 'string') {
      throw createError.invalidArgument(
        `Cannot create a populated book without a valid author`
      );
    }
    return new PopulatedBook({
      ...super.fromPrimitives(primitives),
      author: Author.fromPrimitives(author)
    });
  }
}
