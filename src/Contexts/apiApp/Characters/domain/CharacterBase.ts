import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { Uuid, Metadata } from '../../../shared/domain/valueObject';
import { Nullable } from '../../../shared/domain/Nullable';
import { MetadataType } from '../../../shared/application/MetadataType';
import { Book, PopulatedBook } from '../../Books/domain';
import { CharacterName } from './CharacterName';
import { CharacterPrimitives } from './interfaces';

export interface CharacterProps {
  id: Uuid;
  name?: Nullable<CharacterName>;
  book?: Nullable<Book | PopulatedBook>;
  metadata: Metadata;
}

interface CharacterBasePrimitives {
  id: string;
  metadata: MetadataType;
  name?: string;
}

export class CharacterBase extends AggregateRoot {
  readonly id: Uuid;
  readonly name: Nullable<CharacterName>;
  readonly metadata: Metadata;

  constructor({ id, name = null, metadata }: CharacterProps) {
    super();
    this.id = id;
    this.name = name;
    this.metadata = metadata;
  }

  toPrimitives() {
    const primitives: CharacterPrimitives = {
      id: this.id.value,
      metadata: this.metadata.toPrimitives()
    };

    if (this.name) {
      primitives.name = this.name.value;
    }

    return primitives;
  }

  static fromPrimitives({
    id,
    metadata,
    name
  }: CharacterBasePrimitives): CharacterBase {
    const validId = new Uuid(id);
    const validMetadata = Metadata.fromPrimitives(metadata);
    const validName = name ? new CharacterName(name) : null;

    return new this({
      id: validId,
      name: validName,
      metadata: validMetadata
    });
  }
}
