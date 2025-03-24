import container from '../../../../../../src/apps/apiApp/dependency-injection';
import { CharacterRepository } from '../../../../../../src/Contexts/apiApp/Characters/domain/interfaces';
import { SceneRepository } from '../../../../../../src/Contexts/apiApp/Scenes/domain/interfaces';
import { EnvironmentArranger } from '../../../../shared/infrastructure/arranger/EnvironmentArranger';
import { CharacterMother } from '../../../Characters/domain/mothers';
import { SceneMother } from '../../domain/mothers';

const repository: SceneRepository = container.get(
  'apiApp.Scenes.domain.SceneRepository'
);

const characterRepository: CharacterRepository = container.get(
  'apiApp.Characters.domain.CharacterRepository'
);

const environmentArranger: Promise<EnvironmentArranger> = container.get(
  'apiApp.EnvironmentArranger'
);

describe('MongoSceneRepository', () => {
  beforeEach(async () => {
    await (await environmentArranger).arrange();
  });

  afterAll(async () => {
    await (await environmentArranger).arrange();
    await (await environmentArranger).close();
  });

  describe('save', () => {
    it('should save a scene', async () => {
      const scene = SceneMother.random();

      await repository.save(scene);
    });
  });

  describe('findAll', () => {
    it('should return all scenes', async () => {
      const scene = SceneMother.random();
      await repository.save(scene);

      const scenes = await repository.findAll();

      expect(scenes).toEqual([scene]);
    });

    it('should return only basic and selected props', async () => {
      const scene = SceneMother.random();
      await repository.save(scene);

      const scenes = await repository.findAll({
        fields: ['characters']
      });

      expect(scenes).not.toMatchObject([
        expect.objectContaining({ description: scene.description })
      ]);
    });
  });

  describe('search', () => {
    it('should return a scene by id', async () => {
      const scene = SceneMother.random();
      await repository.save(scene);

      const foundScene = await repository.search(scene.id.value);

      expect(foundScene).toEqual(scene);
    });

    it('should return only basic and selected props', async () => {
      const scene = SceneMother.random();
      await repository.save(scene);

      const foundScene = await repository.search(scene.id.value, {
        fields: ['description']
      });

      expect(foundScene).toMatchObject({
        _id: scene.id.value,
        metadata: scene.metadata,
        description: scene.description
      });
      expect(foundScene).not.toMatchObject({ characters: scene.characters });
    });

    it('should return a scene with populated characters', async () => {
      const character = CharacterMother.random();
      const scene = SceneMother.random({ characters: [character.id] });
      await characterRepository.save(character);
      await repository.save(scene);

      const doc = await repository.search(scene.id.value, {
        include: ['characters']
      });

      expect(doc).toMatchObject({
        _id: scene.id.value,
        metadata: scene.metadata,
        characters: [
          expect.objectContaining({ id: character.id, name: character.name })
        ]
      });
    });

    it('should return a scene with populated characters and selected fields', async () => {
      const character = CharacterMother.random();
      const scene = SceneMother.random({ characters: [character.id] });
      await characterRepository.save(character);
      await repository.save(scene);

      const doc = await repository.search(scene.id.value, {
        include: ['characters'],
        fields: ['description']
      });

      expect(doc).toMatchObject({
        _id: scene.id.value,
        metadata: scene.metadata,
        description: scene.description,
        characters: [expect.objectContaining({ id: character.id })]
      });
    });

    it('should return null when the scene does not exist', async () => {
      const scene = SceneMother.random();

      const foundScene = await repository.search(scene.id.value);

      expect(foundScene).toBeNull();
    });
  });
});
