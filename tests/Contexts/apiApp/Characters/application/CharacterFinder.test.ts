import { CharacterFinder } from '../../../../../src/Contexts/apiApp/Characters/application';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { CharacterRepositoryMock } from '../__mocks__/CharacterRepositoryMock';

const request = {
  id: UuidMother.random().value
};

describe('Character Finder', () => {
  let repository: CharacterRepositoryMock;
  let service: CharacterFinder;

  beforeEach(() => {
    repository = new CharacterRepositoryMock({ find: true });
    service = new CharacterFinder(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a character', async () => {
    await service.run(request);

    repository.assertSearchHasBeenCalledWith(request.id);
  });

  it('should throw an error when the character is not found', async () => {
    repository.setFindable(false);

    await expect(service.run(request)).rejects.toThrow(
      expect.objectContaining({ name: 'NotFoundError' })
    );
  });
});
