import { AuthorCreator } from '../../../../../src/Contexts/apiApp/Authors/application';
import { ConflictError } from '../../../../../src/Contexts/shared/domain/errors/ConflictError';
import { random } from '../../../fixtures/shared';
import { CreateAuthorRepositoryMock } from '../__mocks__/CreateAuthorRepositoryMock';
import { AuthorMother } from '../domain/mothers/AuthorMother';
import { AuthorCreatorRequestMother } from './mothers/AuthorCreatorRequestMother';

const username = random.word();

describe('AuthorCreator', () => {
  let repository: CreateAuthorRepositoryMock;
  let creator: AuthorCreator;

  beforeEach(() => {
    repository = new CreateAuthorRepositoryMock();
    creator = new AuthorCreator(repository);
  });

  it('should create a valid author', async () => {
    const request = AuthorCreatorRequestMother.random();
    const author = AuthorMother.from(request);

    await creator.run(request, username);

    repository.assertSaveHasBeenCalledWith(author);
  });

  it('should throw an error when the author already exists', async () => {
    const request = AuthorCreatorRequestMother.random();
    request.id = 'existing-id';

    await expect(creator.run(request, username)).rejects.toThrow(ConflictError);
  });
});
