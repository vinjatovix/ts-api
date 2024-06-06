import { MetadataType } from '../../../shared/application/MetadataType';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { Uuid } from '../../../shared/domain/valueObject';
import { Metadata } from '../../../shared/domain/valueObject/Metadata';
import { AuthorName } from './AuthorName';

export class Author extends AggregateRoot {
  readonly id: Uuid;
  readonly name: AuthorName;
  readonly metadata: Metadata;

  constructor({
    id,
    name,
    metadata
  }: {
    id: Uuid;
    name: AuthorName;
    metadata: Metadata;
  }) {
    super();
    this.id = id;
    this.name = name;
    this.metadata = metadata;
  }

  toPrimitives() {
    return {
      id: this.id.value,
      name: this.name.value,
      metadata: this.metadata.toPrimitives()
    };
  }

  static fromPrimitives({
    id,
    name,
    metadata
  }: {
    id: string;
    name: string;
    metadata: MetadataType;
  }) {
    return new Author({
      id: new Uuid(id),
      name: new AuthorName(name),
      metadata: Metadata.fromPrimitives(metadata)
    });
  }
}
