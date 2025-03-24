import { ScenePatcher } from '../../../../../src/Contexts/apiApp/Scenes/application/ScenePatcher';
import { ScenePatch } from '../../../../../src/Contexts/apiApp/Scenes/domain/ScenePatch';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { UserMother } from '../../Auth/domain/mothers';
import { CharacterRepositoryMock } from '../../Characters/__mocks__/CharacterRepositoryMock';
import { SceneRepositoryMock } from '../__mocks__/SceneRepositoryMock';
import { SceneCircumstanceMother } from '../domain/mothers';

const username = UserMother.random().username;

const DEFAULT_REQUEST = {
  id: UuidMother.random().value,
  description: SceneCircumstanceMother.random().value,
  characters: [UuidMother.random().value]
};

describe('ScenePatcher', () => {
  let repository: SceneRepositoryMock;
  let charactersRepository: CharacterRepositoryMock;
  let service: ScenePatcher;

  beforeEach(() => {
    repository = new SceneRepositoryMock({ find: true });
    charactersRepository = new CharacterRepositoryMock({ find: true });
    service = new ScenePatcher(repository, charactersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a valid scene', async () => {
    const scenePatch = ScenePatch.fromPrimitives(DEFAULT_REQUEST);

    await service.run(DEFAULT_REQUEST, username.value);

    repository.assertUpdateHasBeenCalledWith(
      expect.objectContaining(scenePatch),
      username
    );
  });

  it('should throw an error when the scene is not found', async () => {
    repository.setFindable(false);

    await expect(service.run(DEFAULT_REQUEST, username.value)).rejects.toThrow(
      expect.objectContaining({ name: 'NotFoundError' })
    );
  });

  it('should throw an error if there is nothing to patch', async () => {
    await expect(
      service.run({ id: DEFAULT_REQUEST.id }, username.value)
    ).rejects.toThrow(
      expect.objectContaining({ name: 'InvalidArgumentError' })
    );
  });
});
