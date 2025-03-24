import { random } from '../../../fixtures/shared';
import { RequestByIdMother } from '../../../fixtures/shared/application/RequestByIdMother';
import { CharacterRepositoryMock } from '../__mocks__/CharacterRepositoryMock';
import { CharacterRemover } from '../../../../../src/Contexts/apiApp/Characters/application/CharacterRemover';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';

const username = random.word();
const request = RequestByIdMother.create(UuidMother.random());

describe('CharacterRemover', () => {
  let repository: CharacterRepositoryMock;
  let service: CharacterRemover;

  beforeEach(() => {
    repository = new CharacterRepositoryMock({ find: true });
    service = new CharacterRemover(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove a character', async () => {
    await service.run(request, username);

    repository.assertRemoveHasBeenCalledWith(request.id);
  });

  it('should not throe an error when the character is not found', async () => {
    repository.setFindable(false);

    await expect(service.run(request, username)).resolves.toBeUndefined();
  });
});
