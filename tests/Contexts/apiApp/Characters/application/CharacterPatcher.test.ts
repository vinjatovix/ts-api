import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';
import { CharacterPatcher } from '../../../../../src/Contexts/apiApp/Characters/application';
import { CharacterPatch } from '../../../../../src/Contexts/apiApp/Characters/domain';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { UserMother } from '../../Auth/domain/mothers';
import { BookRepositoryMock } from '../../Books/__mocks__/BookRepositoryMock';
import { CharacterRepositoryMock } from '../__mocks__/CharacterRepositoryMock';
import { CharacterNameMother } from '../domain/mothers';

const username = UserMother.random().username;
const USERNAME = username.value;

const DEFAULT_REQUEST = {
  id: UuidMother.random().value,
  book: UuidMother.random().value,
  name: CharacterNameMother.random().value
};

describe('CharacterPatcher', () => {
  let repository: CharacterRepositoryMock;
  let bookRepository: BookRepositoryMock;
  let service: CharacterPatcher;

  beforeEach(() => {
    repository = new CharacterRepositoryMock({ find: true });
    bookRepository = new BookRepositoryMock({ find: true });
    service = new CharacterPatcher(repository, bookRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a valid character', async () => {
    const characterPatch = CharacterPatch.fromPrimitives(DEFAULT_REQUEST);

    await service.run(DEFAULT_REQUEST, { username: USERNAME });

    repository.assertUpdateHasBeenCalledWith(
      expect.objectContaining(characterPatch),
      new Username(USERNAME)
    );
  });

  it('should throw an error when the character is not found', async () => {
    repository.setFindable(false);

    await expect(
      service.run(DEFAULT_REQUEST, { username: USERNAME })
    ).rejects.toThrow(expect.objectContaining({ name: 'NotFoundError' }));
  });

  it('should throw an error when the book is not found', async () => {
    bookRepository.setFindable(false);

    await expect(
      service.run(DEFAULT_REQUEST, { username: USERNAME })
    ).rejects.toThrow(expect.objectContaining({ name: 'NotFoundError' }));
  });

  it('should throw an error if there is nothing to patch', async () => {
    await expect(
      service.run({ id: DEFAULT_REQUEST.id }, { username: USERNAME })
    ).rejects.toThrow(
      expect.objectContaining({ name: 'InvalidArgumentError' })
    );
  });
});
