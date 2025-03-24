import { RequestOptions } from '../../../../apps/apiApp/shared/interfaces';
import { RequestById } from '../../../shared/application/interfaces';
import { createError } from '../../../shared/domain/errors';
import { CharacterBuilding } from '../domain';
import {
  CharacterBuildingRepository,
  CharacterBuildingPrimitives
} from '../domain/interfaces';
import { PopulatedCharacterBuilding } from '../domain/PopulatedCharacterBuilding';

export class CharacterBuildingFinder {
  constructor(private readonly repository: CharacterBuildingRepository) {}
  async run(
    { id }: RequestById,
    options: Partial<RequestOptions> = {}
  ): Promise<CharacterBuildingPrimitives> {
    const characterBuilding = (await this.repository.search(id, options)) as
      | CharacterBuilding
      | PopulatedCharacterBuilding;

    if (!characterBuilding) {
      throw createError.notFound(`CharacterBuilding <${id}>`);
    }

    return characterBuilding.toPrimitives();
  }
}
