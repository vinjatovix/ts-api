import { SceneRemover } from '../../../../../src/Contexts/apiApp/Scenes/application';
import { RequestByIdMother } from '../../../fixtures/shared/application/RequestByIdMother';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { UserMother } from '../../Auth/domain/mothers';
import { CharacterBuildingRepositoryMock } from '../../CharacterBuildings/__mocks__/CharacterBuildingRepositoryMock';
import { SceneRepositoryMock } from '../__mocks__/SceneRepositoryMock';

const username = UserMother.random().username.value;
const request = RequestByIdMother.create(UuidMother.random());

describe('SceneRemover', () => {
  let repository: SceneRepositoryMock;
  let characterBuildingRepository: CharacterBuildingRepositoryMock;
  let service: SceneRemover;

  beforeEach(() => {
    repository = new SceneRepositoryMock({ find: true });
    characterBuildingRepository = new CharacterBuildingRepositoryMock({
      find: false
    });
    service = new SceneRemover(repository, characterBuildingRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove a scene', async () => {
    await service.run(request, { username });

    repository.assertRemoveHasBeenCalledWith(request.id);
  });

  it('should not throw an error when the scene is not found', async () => {
    repository.setFindable(false);

    await expect(service.run(request, { username })).resolves.toBeUndefined();
  });

  it('should throw and error if scene has related characterBuildings', async () => {
    characterBuildingRepository.setFindable(true);

    await expect(service.run(request, { username })).rejects.toThrow(
      expect.objectContaining({
        name: 'ConflictError',
        message: expect.stringMatching(
          /^Scene.*has associated character buildings$/
        )
      })
    );
  });
});
