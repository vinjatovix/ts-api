import { Nullable } from '../../../shared/domain/types/';
import { Uuid } from '../../../shared/domain/valueObject';
import { BookBase } from './BookBase';
import { BookPrimitives } from './interfaces';
import { BookProps } from './interfaces/BookProps';

export class Book extends BookBase {
  readonly author: Nullable<Uuid>;

  constructor(props: BookProps) {
    super(props);
    this.author = props.author;
  }

  toPrimitives(): BookPrimitives {
    const primitives = {
      ...super.toPrimitives(),
      author: this.author?.value
    };

    return primitives;
  }

  static readonly fromPrimitives = ({
    author,
    ...primitives
  }: BookPrimitives & { author?: string | null }): Book =>
    new Book({
      ...super.fromPrimitives(primitives),
      author: typeof author === 'string' ? new Uuid(author) : null
    });
}
