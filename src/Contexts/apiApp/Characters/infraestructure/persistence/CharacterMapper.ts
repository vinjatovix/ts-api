import { BookPrimitives } from '../../../Books/domain/interfaces';
import { Character } from '../../domain';
import { PopulatedCharacter } from '../../domain/PopulatedCharacter';
import { CharacterType, PopulatedCharacterType } from '../types';

export class CharacterMapper {
  static toDomain(document: CharacterType): Character {
    return Character.fromPrimitives({
      id: document._id,
      name: document.name,
      book: document.book as string,
      metadata: document.metadata
    });
  }

  static toPopulatedDomain(
    document: PopulatedCharacterType
  ): PopulatedCharacter {
    return PopulatedCharacter.fromPrimitives({
      id: document._id,
      name: document.name,
      book: document.book as BookPrimitives,
      metadata: document.metadata
    });
  }

  static map(character: PopulatedCharacterType | CharacterType | null) {
    if (!character) {
      return null;
    }

    if (typeof character === 'string') {
      return character;
    }

    if (this.isPopulated(character)) {
      return this.toPopulatedDomain(character);
    }

    return this.toDomain(character);
  }

  static isPopulated(
    document: CharacterType | PopulatedCharacterType
  ): document is PopulatedCharacterType {
    return typeof document.book === 'object' && '_id' in document.book;
  }
}
