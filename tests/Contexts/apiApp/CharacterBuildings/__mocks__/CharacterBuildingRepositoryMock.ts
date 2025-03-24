import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';
import { CharacterBuilding } from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain';
import { CharacterBuildingPatch } from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain/CharacterBuildingPatch';
import { CharacterBuildingRepository } from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain/interfaces';
import { BaseRepositoryMock } from '../../shared/__mocks__/BaseRepositoryMock';
import { CharacterBuildingMother } from '../domain/mothers';

export class CharacterBuildingRepositoryMock
  extends BaseRepositoryMock<
    CharacterBuilding,
    CharacterBuildingPatch,
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

  async update(
    characterBuilding: CharacterBuildingPatch,
    username: Username
  ): Promise<void> {
    this.updateMock(characterBuilding, username);
  }
}
