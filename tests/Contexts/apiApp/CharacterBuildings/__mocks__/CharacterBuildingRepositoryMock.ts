import { CharacterBuilding } from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain';
import { CharacterBuildingRepository } from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain/interfaces';
import { BaseRepositoryMock } from '../../shared/__mocks__/BaseRepositoryMock';
import { CharacterBuildingMother } from '../domain/mothers';

export class CharacterBuildingRepositoryMock
  extends BaseRepositoryMock<
    CharacterBuilding,
    CharacterBuilding,
    { id: string }
  >
  implements CharacterBuildingRepository
{
  constructor({ find }: { find: boolean } = { find: false }) {
    super({ find }, [CharacterBuildingMother.random()]);
  }

  protected getId(characterBuilding: CharacterBuilding): string {
    return characterBuilding.id.value;
  }
  protected defaultFindByQuery(query: { id: string }): CharacterBuilding[] {
    const foundBuilds = this.storage.filter(
      (characterBuilding: CharacterBuilding) => {
        const { id } = query;
        return id && characterBuilding.id.value === id;
      }
    );

    return this.isFindable && !foundBuilds.length ? this.storage : foundBuilds;
  }
}
