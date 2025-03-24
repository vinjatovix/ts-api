import { BookRemover } from '../../../../../src/Contexts/apiApp/Books/application';
import { random } from '../../../fixtures/shared';
import { RequestByIdMother } from '../../../fixtures/shared/application/RequestByIdMother';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { CharacterRepositoryMock } from '../../Characters/__mocks__/CharacterRepositoryMock';
import { BookRepositoryMock } from '../__mocks__/BookRepositoryMock';

const username = random.word();
const request = RequestByIdMother.create(UuidMother.random());

describe('BookRemover', () => {
  let repository: BookRepositoryMock;
  let characterRepository: CharacterRepositoryMock;
  let service: BookRemover;

  beforeEach(() => {
    repository = new BookRepositoryMock({ find: true });
    characterRepository = new CharacterRepositoryMock({ find: false });
    service = new BookRemover(repository, characterRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove a book', async () => {
    await service.run(request, { username });

    repository.assertRemoveHasBeenCalledWith(request.id);
  });

  it('should not throw an error when the book is not found', async () => {
    repository.setFindable(false);

    await expect(service.run(request, { username })).resolves.toBeUndefined();
  });

  it('should throw an error the book has associated chars', async () => {
    characterRepository.setFindable(true);

    await expect(service.run(request, { username })).rejects.toThrow(
      expect.objectContaining({ name: 'ConflictError' })
    );
  });
});
