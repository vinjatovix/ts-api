import { Username } from '../../../../../src/Contexts/apiApp/Auth/domain';
import { AuthorPatcher } from '../../../../../src/Contexts/apiApp/Authors/application';
import { AuthorPatch } from '../../../../../src/Contexts/apiApp/Authors/domain';
import { UserMother } from '../../Auth/domain/mothers';
import { AuthorRepositoryMock } from '../__mocks__/AuthorRepositoryMock';
import { AuthorCreatorRequestMother } from './mothers';

const username = UserMother.random();
const USERNAME = username.username.value;
const request = AuthorCreatorRequestMother.random();

describe('AuthorPatcher', () => {
  let repository: AuthorRepositoryMock;
  let service: AuthorPatcher;

  beforeEach(() => {
    repository = new AuthorRepositoryMock({ find: true });
    service = new AuthorPatcher(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a valid author', async () => {
    const author = AuthorPatch.fromPrimitives(request);

    await service.run(request, { username: USERNAME });

    repository.assertUpdateHasBeenCalledWith(
      expect.objectContaining(author),
      new Username(USERNAME)
    );
  });

  it('should throw an error when the author is not found', async () => {
    repository.setFindable(false);

    await expect(service.run(request, { username: USERNAME })).rejects.toThrow(
      expect.objectContaining({ name: 'NotFoundError' })
    );
  });
});
