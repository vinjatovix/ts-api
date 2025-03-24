import { SceneFinder } from '../../../../../src/Contexts/apiApp/Scenes/application';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { SceneRepositoryMock } from '../__mocks__/SceneRepositoryMock';

const request = {
  id: UuidMother.random().value
};

describe('Scene Finder', () => {
  let repository: SceneRepositoryMock;
  let service: SceneFinder;

  beforeEach(() => {
    repository = new SceneRepositoryMock({ find: true });
    service = new SceneFinder(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a scene', async () => {
    await service.run(request);

    repository.assertSearchHasBeenCalledWith(request.id, {});
  });

  it('should throw an error when the scene is not found', async () => {
    repository.setFindable(false);

    await expect(service.run(request)).rejects.toThrow(
      expect.objectContaining({ name: 'NotFoundError' })
    );
  });
});
