import {
  BaseEntityMapper,
  BaseMapper
} from '../../../shared/infrastructure/persistence/mongo';
import { Character, PopulatedCharacter } from '../domain';
import { CharacterPrimitives } from '../domain/interfaces';
import { CharacterType, PopulatedCharacterType } from './types';

export class CharacterMapper extends BaseEntityMapper<
  Character,
  PopulatedCharacter,
  CharacterType,
  PopulatedCharacterType,
  CharacterPrimitives
> {
  toDomain(document: CharacterType): Character {
    const primitives = BaseMapper.mapNestedId(
      document
    ) as unknown as CharacterPrimitives;

    return Character.fromPrimitives(primitives);
  }

  toPopulatedDomain(document: PopulatedCharacterType): PopulatedCharacter {
    const primitives = BaseMapper.mapNestedId(
      document
    ) as unknown as CharacterPrimitives;

    return PopulatedCharacter.fromPrimitives(primitives);
  }

  isPopulatedType(
    document: CharacterType | PopulatedCharacterType
  ): document is PopulatedCharacterType {
    return (
      typeof document.book === 'object' &&
      ('_id' in document.book || 'id' in document.book)
    );
  }

  isPopulatedPrimitives(
    document: CharacterPrimitives
  ): document is CharacterPrimitives {
    return typeof document.book === 'object' && 'id' in document.book;
  }
}
