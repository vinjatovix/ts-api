import { CharacterBuildingPatcher } from '../../../../../src/Contexts/apiApp/CharacterBuildings/application/CharacterBuildingPatcher';
import { UserMother } from '../../Auth/domain/mothers';
import { CharacterBuildingRepositoryMock } from '../__mocks__/CharacterBuildingRepositoryMock';
import { CharacterBuildingCreatorRequestMother } from './mothers/CharacterBuildingCreatorRequestMother';
import { UserRepositoryMock } from '../../Auth/__mocks__/UserRepositoryMock';
import { SceneRepositoryMock } from '../../Scenes/__mocks__/SceneRepositoryMock';
import { CharacterBuildingPatch } from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain/CharacterBuildingPatch';
import {
  SceneCircumstanceMother,
  SceneMother
} from '../../Scenes/domain/mothers';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';
import { CharacterBuilding } from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain';
import { Metadata } from '../../../../../src/Contexts/shared/domain/valueObject';

const DEFAULT_REQUEST = CharacterBuildingCreatorRequestMother.random();
const user = UserMother.random(DEFAULT_REQUEST.actor);
const USERNAME = user.username.value;
const USER_ID = user.id.value;

describe('CharacterBuildingPatcher', () => {
  let repository: CharacterBuildingRepositoryMock;
  let userRepository: UserRepositoryMock;
  let sceneRepository: SceneRepositoryMock;
  let service: CharacterBuildingPatcher;

  beforeEach(() => {
    repository = new CharacterBuildingRepositoryMock();
    userRepository = new UserRepositoryMock();
    sceneRepository = new SceneRepositoryMock({ find: true });
    service = new CharacterBuildingPatcher(
      repository,
      userRepository,
      sceneRepository
    );
    userRepository.addToStorage(user);
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
    repository.addToStorage(
      CharacterBuilding.fromPrimitives({
        ...DEFAULT_REQUEST,
        metadata: new Metadata({
          createdBy: USERNAME,
          updatedBy: USERNAME,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a valid character building', async () => {
    const characterBuildingPatch = CharacterBuildingPatch.fromPrimitives({
      id: DEFAULT_REQUEST.id,
      sceneCircumstances: SceneCircumstanceMother.random().value
    });

    await service.run(
      {
        id: DEFAULT_REQUEST.id,
        sceneCircumstances: characterBuildingPatch.sceneCircumstances?.value
      },
      { username: USERNAME, id: USER_ID }
    );

    repository.assertUpdateHasBeenCalledWith(
      expect.objectContaining(characterBuildingPatch),
      user.username
    );
  });

  it('should throw an error when the character building is not found', async () => {
    await expect(
      service.run(
        { ...DEFAULT_REQUEST, id: UuidMother.random().value },
        { username: USERNAME, id: USER_ID }
      )
    ).rejects.toThrow(expect.objectContaining({ name: 'NotFoundError' }));
  });

  it('should throw an error if there is nothing to patch', async () => {
    await expect(
      service.run(
        { id: DEFAULT_REQUEST.id },
        { username: USERNAME, id: USER_ID }
      )
    ).rejects.toThrow(
      expect.objectContaining({ name: 'InvalidArgumentError' })
    );
  });

  it('should throw an error when patch produces no changes', async () => {
    repository.setFindable(true);
    const storedCharacterBuildings: CharacterBuilding[] =
      await repository.findAll({});
    const storedCharacterBuilding = storedCharacterBuildings[0];

    await expect(
      service.run(
        {
          id: storedCharacterBuilding.id.value,
          scene: storedCharacterBuilding.scene?.value
        },
        { username: USERNAME, id: USER_ID }
      )
    ).rejects.toThrow(
      expect.objectContaining({ name: 'InvalidArgumentError' })
    );
  });

  it('should fail if the actor does not exist', async () => {
    await expect(
      service.run(
        {
          ...DEFAULT_REQUEST,
          actor: UuidMother.random().value
        },
        { username: USERNAME, id: USER_ID }
      )
    ).rejects.toThrow(
      expect.objectContaining({
        name: 'NotFoundError',
        message: expect.stringMatching(/^Actor.*not found.$/)
      })
    );
  });

  it("should fail if the scene doesn't exist", async () => {
    sceneRepository.setFindable(false);

    await expect(
      service.run(
        {
          ...DEFAULT_REQUEST,
          scene: UuidMother.random().value
        },
        { username: USERNAME, id: USER_ID }
      )
    ).rejects.toThrow(
      expect.objectContaining({
        name: 'NotFoundError',
        message: expect.stringMatching(/^Scene.*not found.$/)
      })
    );
  });

  it("should fail if the character doesn't exist in the scene", async () => {
    const sceneId = UuidMother.random();
    sceneRepository.addToStorage(
      SceneMother.random({
        id: sceneId.value,
        characters: [UuidMother.random()]
      })
    );

    await expect(
      service.run(
        { ...DEFAULT_REQUEST, scene: sceneId.value },
        { username: USERNAME, id: USER_ID }
      )
    ).rejects.toThrow(
      expect.objectContaining({
        name: 'ConflictError',
        message: expect.stringMatching(/^Character.*not found in Scene/)
      })
    );
  });

  it("should fail if the relationshipCircumstances character doesn't exist in the scene", async () => {
    const sceneId = UuidMother.random();
    sceneRepository.addToStorage(
      SceneMother.random({
        id: sceneId.value,
        characters: [UuidMother.random()]
      })
    );

    await expect(
      service.run(
        {
          ...DEFAULT_REQUEST,
          scene: sceneId.value,
          relationshipCircumstances: [
            {
              character: UuidMother.random().value,
              circumstance: SceneCircumstanceMother.random().value
            }
          ]
        },
        { username: USERNAME, id: USER_ID }
      )
    ).rejects.toThrow(
      expect.objectContaining({
        name: 'ConflictError',
        message: expect.stringMatching(/^Character.*not found in Scene/)
      })
    );
  });
});
