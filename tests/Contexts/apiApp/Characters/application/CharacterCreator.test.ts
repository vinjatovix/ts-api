import {
  CharacterCreator,
  CharacterCreatorRequest
} from '../../../../../src/Contexts/apiApp/Characters/application';
import { random } from '../../../fixtures/shared';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { UserMother } from '../../Auth/domain/mothers';
import { BookRepositoryMock } from '../../Books/__mocks__';
import { CharacterMother, CharacterNameMother } from '../domain/mothers';
import { CreateCharacterRepositoryMock } from '../__mocks__';

const username = UserMother.random().username.value;
const DEFAULT_REQUEST = {
  id: UuidMother.random().value,
  name: CharacterNameMother.random().value,
  book: UuidMother.random().value
};

describe('CharacterCreator', () => {
  let repository: CreateCharacterRepositoryMock;
  let creator: CharacterCreator;
  let bookRepository: BookRepositoryMock;

  beforeEach(() => {
    repository = new CreateCharacterRepositoryMock();
    bookRepository = new BookRepositoryMock({ find: true });
    creator = new CharacterCreator(repository, bookRepository);
  });

  it('should create a valid Character', async () => {
    const character = CharacterMother.from(DEFAULT_REQUEST, username);

    await creator.run(DEFAULT_REQUEST, username);

    repository.assertSaveHasBeenCalledWith(
      expect.objectContaining({
        ...character,
        metadata: expect.objectContaining({
          createdBy: username
        })
      })
    );
    bookRepository.assertSearchHasBeenCalledWith(DEFAULT_REQUEST.book);
  });

  it('should throw InvalidArgumentError when the character book is not found', async () => {
    bookRepository.setFindable(false);

    await expect(creator.run(DEFAULT_REQUEST, username)).rejects.toThrow(
      expect.objectContaining({ name: 'InvalidArgumentError' })
    );
  });

  test.each(['', random.word(), random.integer(), random.boolean(), {}, []])(
    'should throw an InvalidArgumentError when id is not valid (id: %p)',
    async (id) => {
      const request = {
        ...DEFAULT_REQUEST,
        id
      } as unknown as CharacterCreatorRequest;

      await expect(creator.run(request, username)).rejects.toThrow(
        expect.objectContaining({ name: 'InvalidArgumentError' })
      );
    }
  );

  test.each(['', random.word(), random.integer(), random.boolean(), {}, []])(
    'should throw an InvalidArgumentError when book is not valid (book: %p)',
    async (book) => {
      const request = {
        ...DEFAULT_REQUEST,
        book
      } as unknown as CharacterCreatorRequest;

      await expect(creator.run(request, username)).rejects.toThrow(
        expect.objectContaining({ name: 'InvalidArgumentError' })
      );
    }
  );

  it('should fail if character does exist', async () => {
    repository.setFindable(true);

    await expect(creator.run(DEFAULT_REQUEST, username)).rejects.toThrow(
      expect.objectContaining({ name: 'InvalidArgumentError' })
    );
  });
});
