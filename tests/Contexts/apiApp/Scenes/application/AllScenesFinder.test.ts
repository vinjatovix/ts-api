import { AllScenesFinder } from '../../../../../src/Contexts/apiApp/Scenes/application/AllScenesFinder';
import { SceneRepositoryMock } from '../__mocks__/SceneRepositoryMock';

describe('AllScenesFinder', () => {
  let repository: SceneRepositoryMock;
  let service: AllScenesFinder;

  beforeEach(() => {
    repository = new SceneRepositoryMock();
    service = new AllScenesFinder(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find all scenes', async () => {
    await service.run();

    repository.assertFindAllHasBeenCalled();
  });

  it('should find all scenes with options', async () => {
    const options = { include: ['chatacters'] };

    await service.run(options);

    repository.assertFindAllHasBeenCalledWith(options);
  });
});
