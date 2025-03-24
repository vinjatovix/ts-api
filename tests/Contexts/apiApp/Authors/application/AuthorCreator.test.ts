import { AuthorCreator } from '../../../../../src/Contexts/apiApp/Authors/application';
import { UserMother } from '../../Auth/domain/mothers';
import { AuthorRepositoryMock } from '../__mocks__/AuthorRepositoryMock';

import { AuthorMother } from '../domain/mothers';
import { AuthorCreatorRequestMother } from './mothers';

const username = UserMother.random().username.value;

describe('AuthorCreator', () => {
  let repository: AuthorRepositoryMock;
  let service: AuthorCreator;

  beforeEach(() => {
    repository = new AuthorRepositoryMock();
    service = new AuthorCreator(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a valid author', async () => {
    const request = AuthorCreatorRequestMother.random();
    const author = AuthorMother.from(request);

    await service.run(request, username);

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
    repository.setFindable(true);
    const request = AuthorCreatorRequestMother.random();

    await expect(service.run(request, username)).rejects.toThrow(
      expect.objectContaining({ name: 'ConflictError' })
    );
  });
});
