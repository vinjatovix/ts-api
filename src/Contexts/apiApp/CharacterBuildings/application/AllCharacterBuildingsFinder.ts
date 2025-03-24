import { RequestOptions } from '../../../../apps/apiApp/shared/interfaces';
import { CharacterBuilding } from '../domain';
import {
  CharacterBuildingPrimitives,
  CharacterBuildingRepository
} from '../domain/interfaces';
import { PopulatedCharacterBuilding } from '../domain/PopulatedCharacterBuilding';

export class AllCharacterBuildingsFinder {
  constructor(private readonly repository: CharacterBuildingRepository) {}

  async run(
    options: Partial<RequestOptions> = {}
  ): Promise<CharacterBuildingPrimitives[]> {
    const characterBuildings: Array<
      CharacterBuilding | PopulatedCharacterBuilding
    > = await this.repository.findAll(options);

    return characterBuildings.map((characterBuilding) =>
      characterBuilding.toPrimitives()
    );
  }
}
