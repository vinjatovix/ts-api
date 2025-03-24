import { AggregateRoot } from '../../../shared/domain';
import { Nullable } from '../../../shared/domain/types';
import { Uuid, Metadata } from '../../../shared/domain/valueObject';
import { MetadataType } from '../../../shared/infrastructure/persistence/mongo/types';
import { AuthorName } from './AuthorName';
import { AuthorProps } from './interfaces';

export class Author extends AggregateRoot {
  readonly id: Uuid;
  readonly name: Nullable<AuthorName>;
  readonly metadata: Metadata;

  constructor({ id, name, metadata }: AuthorProps) {
    super();
    this.id = id;
    this.name = name;
    this.metadata = metadata;
  }

  toPrimitives() {
    return {
      id: this.id.value,
      name: this.name?.value,
      metadata: this.metadata.toPrimitives()
    };
  }

  static fromPrimitives({
    id,
    name,
    metadata
  }: {
    id: string;
    name?: string;
    metadata: MetadataType;
  }) {
    return new Author({
      id: new Uuid(id),
      name: name ? new AuthorName(name) : null,
      metadata: Metadata.fromPrimitives(metadata)
    });
  }
}
