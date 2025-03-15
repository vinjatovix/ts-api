import { SceneRemover } from '../../../../../src/Contexts/apiApp/Scenes/application/SceneRemover';
import { RequestByIdMother } from '../../../fixtures/shared/application/RequestByIdMother';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { UserMother } from '../../Auth/domain/mothers';
import { SceneRepositoryMock } from '../__mocks__/SceneRepositoryMock';

const username = UserMother.random().username.value;
const request = RequestByIdMother.create(UuidMother.random());

describe('SceneRemover', () => {
  let repository: SceneRepositoryMock;
  let service: SceneRemover;

  beforeEach(() => {
    repository = new SceneRepositoryMock({ find: true });
    service = new SceneRemover(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove a scene', async () => {
    await service.run(request, username);

    repository.assertRemoveHasBeenCalledWith(request.id);
  });

  it('should not throw an error when the scene is not found', async () => {
    repository.setFindable(false);

    await expect(service.run(request, username)).resolves.toBeUndefined();
  });
});
