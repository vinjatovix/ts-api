import { CharacterBuildingRemover } from '../../../../../src/Contexts/apiApp/CharacterBuildings/application/CharacterBuildingRemover';
import { Uuid } from '../../../../../src/Contexts/shared/domain/valueObject';
import { random } from '../../../fixtures/shared';
import { RequestByIdMother } from '../../../fixtures/shared/application/RequestByIdMother';
import { UserMother } from '../../Auth/domain/mothers';
import { CharacterBuildingRepositoryMock } from '../__mocks__/CharacterBuildingRepositoryMock';
import { CharacterBuildingMother } from '../domain/mothers';
import { CharacterBuildingCreatorRequestMother } from './mothers/CharacterBuildingCreatorRequestMother';

const DEFAULT_REQUEST = CharacterBuildingCreatorRequestMother.random();
const user = UserMother.random(DEFAULT_REQUEST.actor);
const username = user.username.value;
const id = user.id.value;
const request = RequestByIdMother.create(new Uuid(DEFAULT_REQUEST.id));

describe('CharacterBuildingRemover', () => {
  let repository: CharacterBuildingRepositoryMock;
  let service: CharacterBuildingRemover;

  beforeEach(() => {
    repository = new CharacterBuildingRepositoryMock();
    service = new CharacterBuildingRemover(repository);
    repository.addToStorage(
      CharacterBuildingMother.from(DEFAULT_REQUEST, username)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove a character building', async () => {
    await service.run(request, { username, id });

    repository.assertRemoveHasBeenCalledWith(request.id);
  });

  it('should not throw an error when the character building is not found', async () => {
    repository.setFindable(false);

    await expect(
      service.run(request, { username, id })
    ).resolves.toBeUndefined();
  });

  it('should throw an error when the user is not the actor', async () => {
    await expect(
      service.run(request, { username, id: random.uuid() })
    ).rejects.toThrow(expect.objectContaining({ name: 'ForbiddenError' }));
  });
});
