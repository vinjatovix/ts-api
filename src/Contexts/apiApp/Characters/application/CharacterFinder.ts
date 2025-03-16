import { RequestOptions } from '../../../../apps/apiApp/shared/interfaces';
import { RequestById } from '../../../shared/application/interfaces';
import { createError } from '../../../shared/domain/errors';
import { Character, PopulatedCharacter } from '../domain';
import { CharacterPrimitives, CharacterRepository } from '../domain/interfaces';

export class CharacterFinder {
  constructor(private readonly repository: CharacterRepository) {}
  async run(
    { id }: RequestById,
    options: Partial<RequestOptions> = {}
  ): Promise<Partial<CharacterPrimitives>> {
    const character = (await this.repository.search(id, options)) as
      | Character
      | PopulatedCharacter;

    if (!character) {
      throw createError.notFound(`Character <${id}>`);
    }

    return character.toPrimitives();
  }
}
