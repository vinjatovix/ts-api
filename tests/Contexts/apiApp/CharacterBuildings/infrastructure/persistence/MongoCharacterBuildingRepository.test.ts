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

  describe('findAll', () => {
    it('should return all character buildings', async () => {
      const characterBuilding = CharacterBuildingMother.random();
      await repository.save(characterBuilding);

      const characterBuildings = await repository.findAll();

      expect(characterBuildings).toEqual([characterBuilding]);
    });

    it('should return only basic and selected props', async () => {
      const characterBuilding = CharacterBuildingMother.random();
      await repository.save(characterBuilding);

      const characterBuildings = await repository.findAll({
        fields: ['actor']
      });

      expect(characterBuildings[0]).not.toMatchObject({
        character: characterBuilding.character
      });
    });
  });

  describe('search', () => {
    it('should return an existing character building', async () => {
      const characterBuilding = CharacterBuildingMother.random();

      await repository.save(characterBuilding);

      expect(await repository.search(characterBuilding.id.value)).toEqual(
        characterBuilding
      );
    });

    it('should not return a non existing character building', async () => {
      expect(
        await repository.search(CharacterBuildingMother.random().id.value)
      ).toBeNull();
    });

    it('should return only basic and selected props', async () => {
      const characterBuilding = CharacterBuildingMother.random();
      await repository.save(characterBuilding);

      const storedCharacterBuilding = await repository.search(
        characterBuilding.id.value,
        { fields: ['actor'] }
      );

      expect(storedCharacterBuilding).not.toMatchObject({
        character: characterBuilding.character
      });
    });
  });

  describe('remove', () => {
    it('should remove an existing character building', async () => {
      const characterBuilding = CharacterBuildingMother.random();
      await repository.save(characterBuilding);

      await repository.remove(characterBuilding.id.value);

      expect(await repository.search(characterBuilding.id.value)).toBeNull();
    });
  });
});
