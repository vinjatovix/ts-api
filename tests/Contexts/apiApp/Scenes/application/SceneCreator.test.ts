import { SceneCreator } from '../../../../../src/Contexts/apiApp/Scenes/application/SceneCreator';
import { UserMother } from '../../Auth/domain/mothers';
import { CharacterRepositoryMock } from '../../Characters/__mocks__/CharacterRepositoryMock';
import { SceneRepositoryMock } from '../__mocks__/SceneRepositoryMock';
import { SceneMother } from '../domain/mothers';
import { SceneCreatorRequestMother } from './mothers';

const username = UserMother.random().username.value;

describe('SceneCreator', () => {
  let repository: SceneRepositoryMock;
  let characterRepository: CharacterRepositoryMock;
  let service: SceneCreator;

  beforeEach(() => {
    repository = new SceneRepositoryMock();
    characterRepository = new CharacterRepositoryMock({ find: true });
    service = new SceneCreator(repository, characterRepository);
  });

  it('should create a valid scene', async () => {
    const request = SceneCreatorRequestMother.random();
    const scene = SceneMother.from(request, username);

    await service.run(request, username);

    repository.assertSaveHasBeenCalledWith(
      expect.objectContaining({
        ...scene,
        metadata: expect.objectContaining({
          createdBy: username
        })
      })
    );
  });

  it('should throw not found error if some character does not exist', async () => {
    characterRepository.setFindable(false);

    const request = SceneCreatorRequestMother.random();

    await expect(service.run(request, username)).rejects.toThrow(
      expect.objectContaining({ name: 'NotFoundError' })
    );
  });
});
