import { StringsMap } from '../../../../../src/apps/apiApp/shared/interfaces';
import { RegisterUserRequest } from '../../../../../src/Contexts/apiApp/Auth/application/interfaces';
import { AuthorCreatorRequest } from '../../../../../src/Contexts/apiApp/Authors/application/interfaces';
import { BookCreatorRequest } from '../../../../../src/Contexts/apiApp/Books/application/interfaces';
import { CharacterBuildingCreatorRequest } from '../../../../../src/Contexts/apiApp/CharacterBuildings/application/interfaces';
import { Center } from '../../../../../src/Contexts/apiApp/CharacterBuildings/domain';
import { CharacterCreatorRequest } from '../../../../../src/Contexts/apiApp/Characters/application/interfaces';
import { SceneCreatorRequest } from '../../../../../src/Contexts/apiApp/Scenes/application/interfaces';
import { Uuid } from '../../../../../src/Contexts/shared/domain/valueObject';
import { RegisterUserRequestMother } from '../../../../Contexts/apiApp/Auth/application/mothers';
import { BookCreatorRequestMother } from '../../../../Contexts/apiApp/Books/application/mothers';
import { CharacterBuildingCreatorRequestMother } from '../../../../Contexts/apiApp/CharacterBuildings/application/mothers/CharacterBuildingCreatorRequestMother';
import { CharacterCreatorRequestMother } from '../../../../Contexts/apiApp/Characters/application/mothers';
import { CharacterNameMother } from '../../../../Contexts/apiApp/Characters/domain/mothers';
import { SceneCreatorRequestMother } from '../../../../Contexts/apiApp/Scenes/application/mothers';
import { SceneCircumstanceMother } from '../../../../Contexts/apiApp/Scenes/domain/mothers';

type CreateDependencyFunction = (entity: string) => Promise<StringsMap>;

const dependencyFactory: Record<
  string,
  (creator: CreateDependencyFunction) => Promise<StringsMap>
> = {
  book: async (creator) => await creator('author'),
  character: async (creator) => await creator('book'),
  scene: async (creator) => await creator('character'),
  characterBuilding: async (creator) => {
    const { id: sceneId, characters } = await creator('scene');
    const { id: actorId } = await creator('actor');

    return {
      scene: sceneId,
      actor: actorId,
      character: characters[0]
    };
  }
};

const createDependenciesByEntity = async (
  entity: string,
  creator: CreateDependencyFunction
): Promise<StringsMap> => {
  return dependencyFactory[entity]?.(creator) ?? {};
};

interface PayloadStrategy<T> {
  getPayload(id: string, creator: CreateDependencyFunction): Promise<T>;
}

abstract class BasePayloadStrategy<T> implements PayloadStrategy<T> {
  abstract getPayload(
    id: string,
    creator: CreateDependencyFunction
  ): Promise<T>;

  protected async createDependencies(
    entity: string,
    creator: CreateDependencyFunction
  ): Promise<StringsMap> {
    return await createDependenciesByEntity(entity, creator);
  }
}

class AuthorPayloadStrategy extends BasePayloadStrategy<AuthorCreatorRequest> {
  async getPayload(id: string): Promise<AuthorCreatorRequest> {
    return { id, name: 'test author' };
  }
}

class ActorPayloadStrategy extends BasePayloadStrategy<RegisterUserRequest> {
  async getPayload(id: string): Promise<RegisterUserRequest> {
    const actor = RegisterUserRequestMother.random(id);

    return { ...actor, repeatPassword: actor.password };
  }
}

class BookPayloadStrategy extends BasePayloadStrategy<BookCreatorRequest> {
  async getPayload(
    id: string,
    creator: CreateDependencyFunction
  ): Promise<BookCreatorRequest> {
    const bookRequest = BookCreatorRequestMother.random(id);
    const { id: authorId } = await this.createDependencies('book', creator);

    return { ...bookRequest, author: authorId };
  }
}

class CharacterPayloadStrategy extends BasePayloadStrategy<CharacterCreatorRequest> {
  async getPayload(
    id: string,
    creator: CreateDependencyFunction
  ): Promise<CharacterCreatorRequest> {
    const { id: bookId } = await this.createDependencies('character', creator);

    return CharacterCreatorRequestMother.create({
      id: new Uuid(id),
      book: new Uuid(bookId),
      name: CharacterNameMother.random()
    });
  }
}

class ScenePayloadStrategy extends BasePayloadStrategy<SceneCreatorRequest> {
  async getPayload(
    id: string,
    creator: CreateDependencyFunction
  ): Promise<SceneCreatorRequest> {
    const { id: characterId } = await this.createDependencies('scene', creator);

    return SceneCreatorRequestMother.create({
      id: new Uuid(id),
      characters: [new Uuid(characterId)],
      description: SceneCircumstanceMother.random()
    });
  }
}

class CharacterBuildingPayloadStrategy extends BasePayloadStrategy<CharacterBuildingCreatorRequest> {
  async getPayload(
    id: string,
    creator: CreateDependencyFunction
  ): Promise<CharacterBuildingCreatorRequest> {
    const { scene, character } = await this.createDependencies(
      'characterBuilding',
      creator
    );
    const { id: actor } = await creator('actor');

    return CharacterBuildingCreatorRequestMother.create({
      id: new Uuid(id),
      scene: new Uuid(scene),
      actor: new Uuid(actor),
      character: new Uuid(character),
      center: new Center('mental'),
      sceneCircumstances: SceneCircumstanceMother.random(),
      previousCircumstances: SceneCircumstanceMother.random(),
      relationshipCircumstances: []
    });
  }
}

export class PayloadFactory {
  private static readonly strategies: Record<string, PayloadStrategy<unknown>> =
    {
      actor: new ActorPayloadStrategy(),
      author: new AuthorPayloadStrategy(),
      book: new BookPayloadStrategy(),
      character: new CharacterPayloadStrategy(),
      scene: new ScenePayloadStrategy(),
      characterBuilding: new CharacterBuildingPayloadStrategy()
    };

  static async getPayload<T>(
    entity: string,
    id: string,
    creator: CreateDependencyFunction
  ): Promise<T> {
    const strategy = this.strategies[entity];
    if (!strategy) throw new Error(`No strategy found for entity: ${entity}`);

    return strategy.getPayload(id, creator) as Promise<T>;
  }
}
