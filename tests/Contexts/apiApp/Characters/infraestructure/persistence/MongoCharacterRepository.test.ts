import container from '../../../../../../src/apps/apiApp/dependency-injection';
import { CharacterPatch } from '../../../../../../src/Contexts/apiApp/Characters/domain';
import { CharacterRepository } from '../../../../../../src/Contexts/apiApp/Characters/domain/interfaces/';
import { EnvironmentArranger } from '../../../../shared/infrastructure/arranger/EnvironmentArranger';
import { UserMother } from '../../../Auth/domain/mothers';
import { CharacterMother, CharacterNameMother } from '../../domain/mothers';

const repository: CharacterRepository = container.get(
  'apiApp.Characters.domain.CharacterRepository'
);

const environmentArranger: Promise<EnvironmentArranger> = container.get(
  'apiApp.EnvironmentArranger'
);

const username = UserMother.random().username;

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

  describe('update', () => {
    it('should update an existing character', async () => {
      const char = CharacterMother.random();
      await repository.save(char);
      const updatedCharacter = CharacterPatch.fromPrimitives({
        id: char.id.value,
        name: CharacterNameMother.random().value
      });

      await repository.update(updatedCharacter, username);

      expect(await repository.search(char.id.value)).toMatchObject({
        metadata: { updatedBy: username.value }
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of existing characters', async () => {
      const char1 = CharacterMother.random();
      await repository.save(char1);
      const char2 = CharacterMother.random();
      await repository.save(char2);

      expect(await repository.findAll()).toEqual(
        expect.arrayContaining([char1, char2])
      );
    });
  });

  describe('search', () => {
    it('should return an existing character', async () => {
      const character = CharacterMother.random();

      await repository.save(character);

      expect(await repository.search(character.id.value)).toEqual(character);
    });

    it('should not return a non existing character', async () => {
      expect(
        await repository.search(CharacterMother.random().id.value)
      ).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove an existing character', async () => {
      const char = CharacterMother.random();
      await repository.save(char);

      await repository.remove(char.id.value);

      expect(await repository.search(char.id.value)).toBeNull();
    });
  });
});
