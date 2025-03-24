import { RequestOptions } from '../../../../../apps/apiApp/shared/interfaces';
import { Username } from '../../../Auth/domain';
import { CharacterBuilding } from '../CharacterBuilding';
import { CharacterBuildingPatch } from '../CharacterBuildingPatch';
import { PopulatedCharacterBuilding } from '../PopulatedCharacterBuilding';

export interface CharacterBuildingRepository {
  save(data: CharacterBuilding): Promise<void>;

  findByQuery(query: {
    id?: string;
    scene?: string;
  }): Promise<CharacterBuilding[]>;

  findAll(
    options?: Partial<RequestOptions>
  ): Promise<CharacterBuilding[] | PopulatedCharacterBuilding[]>;

  search(
    id: string,
    options?: Partial<RequestOptions>
  ): Promise<Partial<CharacterBuilding | PopulatedCharacterBuilding> | null>;

  remove(id: string): Promise<void>;

  update(data: CharacterBuildingPatch, user: Username): Promise<void>;
}
