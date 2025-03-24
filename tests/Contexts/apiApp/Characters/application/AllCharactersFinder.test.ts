import { AllCharactersFinder } from '../../../../../src/Contexts/apiApp/Characters/application';
import { CharacterRepositoryMock } from '../__mocks__/CharacterRepositoryMock';

describe('AllCharactersFinder', () => {
  let repository: CharacterRepositoryMock;
  let finder: AllCharactersFinder;

  beforeEach(() => {
    repository = new CharacterRepositoryMock();
    finder = new AllCharactersFinder(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find all characters', async () => {
    await finder.run();

    repository.assertFindAllHasBeenCalled();
  });
});
