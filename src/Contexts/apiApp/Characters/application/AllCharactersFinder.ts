import { RequestOptions } from '../../../../apps/apiApp/shared/interfaces';
import { Character, PopulatedCharacter } from '../domain';
import { CharacterPrimitives, CharacterRepository } from '../domain/interfaces';

export class AllCharactersFinder {
  constructor(private readonly repository: CharacterRepository) {}

  async run(
    options: Partial<RequestOptions> = {}
  ): Promise<Partial<CharacterPrimitives[]>> {
    const characters: Array<Character | PopulatedCharacter> =
      await this.repository.findAll(options);

    return characters.map((char) => char.toPrimitives());
  }
}
