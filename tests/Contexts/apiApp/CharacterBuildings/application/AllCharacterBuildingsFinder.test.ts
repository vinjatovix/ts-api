import { AllCharacterBuildingsFinder } from '../../../../../src/Contexts/apiApp/CharacterBuildings/application/AllCharacterBuildingsFinder';
import { CharacterBuildingRepositoryMock } from '../__mocks__/CharacterBuildingRepositoryMock';

describe('AllCharacterBuildingsFinder', () => {
  let repository: CharacterBuildingRepositoryMock;
  let service: AllCharacterBuildingsFinder;

  beforeEach(() => {
    repository = new CharacterBuildingRepositoryMock();
    service = new AllCharacterBuildingsFinder(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find all character buildings', async () => {
    await service.run();

    repository.assertFindAllHasBeenCalled();
  });

  it('should find all character buildings with options', async () => {
    const options = { include: ['character'] };

    await service.run(options);

    repository.assertFindAllHasBeenCalledWith(options);
  });
});
