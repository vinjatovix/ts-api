import { AuthorCreator } from '../../../../../src/Contexts/apiApp/Authors/application';
import { UserMother } from '../../Auth/domain/mothers';

import { CreateAuthorRepositoryMock } from '../__mocks__/CreateAuthorRepositoryMock';
import { AuthorMother } from '../domain/mothers/AuthorMother';
import { AuthorCreatorRequestMother } from './mothers/AuthorCreatorRequestMother';

const username = UserMother.random().username.value;

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

    repository.assertSaveHasBeenCalledWith(
      expect.objectContaining({
        ...author,
        metadata: expect.objectContaining({
          createdBy: username
        })
      })
    );
  });

  it('should throw an error when the author already exists', async () => {
    const request = AuthorCreatorRequestMother.random();
    request.id = 'existing-id';

    await expect(creator.run(request, username)).rejects.toThrow(
      expect.objectContaining({ name: 'ConflictError' })
    );
  });
});
