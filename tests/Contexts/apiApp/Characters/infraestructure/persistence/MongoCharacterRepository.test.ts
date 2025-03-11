import container from '../../../../../../src/apps/apiApp/dependency-injection';
import { CharacterRepository } from '../../../../../../src/Contexts/apiApp/Characters/domain/interfaces/';
import { EnvironmentArranger } from '../../../../shared/infrastructure/arranger/EnvironmentArranger';
import { CharacterMother } from '../../domain/mothers';

const repository: CharacterRepository = container.get(
  'apiApp.Characters.domain.CharacterRepository'
);

const environmentArranger: Promise<EnvironmentArranger> = container.get(
  'apiApp.EnvironmentArranger'
);

describe('MongoCharacterRepository', () => {
  beforeEach(async () => {
    await (await environmentArranger).arrange();
  });

  afterAll(async () => {
    await (await environmentArranger).arrange();
    await (await environmentArranger).close();
  });

  describe('save', () => {
    it('should save a character', async () => {
      const character = CharacterMother.random();

      await repository.save(character);
    });
  });
});
