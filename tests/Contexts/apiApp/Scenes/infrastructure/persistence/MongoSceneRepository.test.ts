import container from '../../../../../../src/apps/apiApp/dependency-injection';
import { SceneRepository } from '../../../../../../src/Contexts/apiApp/Scenes/domain/interfaces';
import { EnvironmentArranger } from '../../../../shared/infrastructure/arranger/EnvironmentArranger';
import { SceneMother } from '../../domain/mothers';

const repository: SceneRepository = container.get(
  'apiApp.Scenes.domain.SceneRepository'
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
});
