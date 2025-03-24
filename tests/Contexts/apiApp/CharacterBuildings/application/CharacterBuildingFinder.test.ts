import { CharacterBuildingFinder } from '../../../../../src/Contexts/apiApp/CharacterBuildings/application/CharacterBuildingFinder';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { CharacterBuildingRepositoryMock } from '../__mocks__/CharacterBuildingRepositoryMock';

const request = {
  id: UuidMother.random().value
};

describe('CharacterBuildingFinder', () => {
  let repository: CharacterBuildingRepositoryMock;
  let service: CharacterBuildingFinder;

  beforeEach(() => {
    repository = new CharacterBuildingRepositoryMock({ find: true });
    service = new CharacterBuildingFinder(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a character building', async () => {
    await service.run(request);

    repository.assertSearchHasBeenCalledWith(request.id);
  });

  it('should throw an error when the character building is not found', async () => {
    repository.setFindable(false);

    await expect(service.run(request)).rejects.toThrow(
      expect.objectContaining({ name: 'NotFoundError' })
    );
  });
});
