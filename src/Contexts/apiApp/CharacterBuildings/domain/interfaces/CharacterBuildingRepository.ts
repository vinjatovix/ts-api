import { CharacterBuilding } from '../CharacterBuilding';

export interface CharacterBuildingRepository {
  save(data: CharacterBuilding): Promise<void>;

  findByQuery(query: { id: string }): Promise<CharacterBuilding[]>;
}
