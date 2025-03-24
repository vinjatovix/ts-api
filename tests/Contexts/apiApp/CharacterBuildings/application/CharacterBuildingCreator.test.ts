import { CharacterBuildingCreator } from '../../../../../src/Contexts/apiApp/CharacterBuildings/application/CharacterBuildingCreator';
import { random } from '../../../fixtures/shared';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { UserRepositoryMock } from '../../Auth/__mocks__/UserRepositoryMock';
import { UserMother } from '../../Auth/domain/mothers';
import { SceneRepositoryMock } from '../../Scenes/__mocks__/SceneRepositoryMock';
import {
  SceneCircumstanceMother,
  SceneMother
} from '../../Scenes/domain/mothers';
import { CharacterBuildingRepositoryMock } from '../__mocks__/CharacterBuildingRepositoryMock';

const username = UserMother.random().username.value;
const DEFAULT_REQUEST = {
  id: UuidMother.random().value,
  actor: UuidMother.random().value,
  character: UuidMother.random().value,
  scene: UuidMother.random().value,
  center: random.arrayElement(['mental', 'emotional', 'instinctive']) as string,
  sceneCircumstances: SceneCircumstanceMother.random().value,
  previousCircumstances: SceneCircumstanceMother.random().value,
  relationshipCircumstances: [
    {
      character: UuidMother.random().value,
      circumstance: SceneCircumstanceMother.random().value
    }
  ],
  actionUnits: [
    {
      action: random.word(),
      strategies: [random.word()]
    }
  ]
};

describe('CharacterBuildingCreator', () => {
  let repository: CharacterBuildingRepositoryMock;
  let userRepository: UserRepositoryMock;
  let sceneRepository: SceneRepositoryMock;
  let service: CharacterBuildingCreator;

  beforeEach(() => {
    repository = new CharacterBuildingRepositoryMock({ find: false });
    userRepository = new UserRepositoryMock({ find: true });
    sceneRepository = new SceneRepositoryMock({ find: true });
    service = new CharacterBuildingCreator(
      repository,
      userRepository,
      sceneRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a valid CharacterBuilding', async () => {
    sceneRepository.addToStorage(
      SceneMother.random({
        id: DEFAULT_REQUEST.scene,
        characters: [
          UuidMother.create(DEFAULT_REQUEST.character),
          UuidMother.create(
            DEFAULT_REQUEST.relationshipCircumstances[0].character
          )
        ]
      })
    );

    await service.run(DEFAULT_REQUEST, username);

    repository.assertSaveHasBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          createdBy: username
        })
      })
    );
    userRepository.assertFindByQueryHasBeenCalledWith({
      id: expect.any(String)
    });
    sceneRepository.assertSearchHasBeenCalledWith(DEFAULT_REQUEST.scene, {
      fields: ['characters']
    });
  });

  it('should fail if id exists', async () => {
    repository.setFindable(true);

    await expect(service.run(DEFAULT_REQUEST, username)).rejects.toThrow(
      expect.objectContaining({
        name: 'ConflictError',
        message: expect.stringMatching(/^CharacterBuilding:.* already exists.$/)
      })
    );
  });

  it("should fail when the actor doesn't exist", async () => {
    userRepository.setIsFindable(false);

    await expect(service.run(DEFAULT_REQUEST, username)).rejects.toThrow(
      expect.objectContaining({
        name: 'NotFoundError',
        message: expect.stringMatching(/^Actor.*not found\.$/)
      })
    );
  });

  it("should fail if the scene doesn't exist", async () => {
    sceneRepository.setFindable(false);

    await expect(service.run(DEFAULT_REQUEST, username)).rejects.toThrow(
      expect.objectContaining({
        name: 'NotFoundError',
        message: expect.stringMatching(/^Scene.*not found.$/)
      })
    );
  });

  it("should fail if the character doesn't exist in the scene", async () => {
    sceneRepository.addToStorage(
      SceneMother.random({
        id: DEFAULT_REQUEST.scene,
        characters: [UuidMother.random()]
      })
    );

    await expect(service.run(DEFAULT_REQUEST, username)).rejects.toThrow(
      expect.objectContaining({
        name: 'ConflictError',
        message: expect.stringMatching(/^Character.*not found in Scene/)
      })
    );
  });

  it("should fail if the relationship character doesn't exist in the scene", async () => {
    sceneRepository.addToStorage(
      SceneMother.random({
        id: DEFAULT_REQUEST.scene,
        characters: [UuidMother.create(DEFAULT_REQUEST.character)]
      })
    );

    await expect(service.run(DEFAULT_REQUEST, username)).rejects.toThrow(
      expect.objectContaining({
        name: 'ConflictError',
        message: expect.stringMatching(/^Character.*not found in Scene/)
      })
    );
  });

  it('should fail if center is not one of valid centers', async () => {
    sceneRepository.addToStorage(
      SceneMother.random({
        id: DEFAULT_REQUEST.scene,
        characters: [
          UuidMother.create(DEFAULT_REQUEST.character),
          UuidMother.create(
            DEFAULT_REQUEST.relationshipCircumstances[0].character
          )
        ]
      })
    );

    await expect(
      service.run(
        {
          ...DEFAULT_REQUEST,
          center: 'unknown'
        },
        username
      )
    ).rejects.toThrow(
      expect.objectContaining({
        name: 'InvalidArgumentError',
        message: expect.stringMatching(/^<Center> does not allow the value/)
      })
    );
  });
});
