import container from '../../../../../../src/apps/apiApp/dependency-injection';
import { CharacterBuildingRepository } from '../../../../../../src/Contexts/apiApp/CharacterBuildings/domain/interfaces';
import { EnvironmentArranger } from '../../../../shared/infrastructure/arranger/EnvironmentArranger';
import { CharacterBuildingMother } from '../../domain/mothers';

const environmentArranger: Promise<EnvironmentArranger> = container.get(
  'apiApp.EnvironmentArranger'
);

const repository: CharacterBuildingRepository = container.get(
  'apiApp.CharacterBuildings.domain.CharacterBuildingRepository'
);

describe('MongoCharacterBuildingRepository', () => {
  beforeEach(async () => {
    await (await environmentArranger).arrange();
  });

  afterAll(async () => {
    await (await environmentArranger).arrange();
    await (await environmentArranger).close();
  });
  describe('save', () => {
    it('should save a character building', async () => {
      const characterBuilding = CharacterBuildingMother.random();

      await repository.save(characterBuilding);
    });
  });
});
