import {
  AfterAll,
  BeforeAll,
  Given,
  Then,
  DataTable
} from '@cucumber/cucumber';
import { assert, expect } from 'chai';
import request from 'supertest';
import { ApiApp } from '../../../../../src/apps/apiApp/ApiApp';
import container from '../../../../../src/apps/apiApp/dependency-injection';
import { API_PREFIXES } from '../../../../../src/apps/apiApp/routes/shared';
import { StringsMap } from '../../../../../src/apps/apiApp/shared/interfaces';
import { Uuid } from '../../../../../src/Contexts/shared/domain/valueObject';
import { Nullable } from '../../../../../src/Contexts/shared/domain/types';
import { EnvironmentArranger } from '../../../../Contexts/shared/infrastructure/arranger/EnvironmentArranger';
import { EncrypterTool } from '../../../../../src/Contexts/shared/plugins';
import { random } from '../../../../Contexts/fixtures/shared';
import { UserMother } from '../../../../Contexts/apiApp/Auth/domain/mothers';
import { AuthorCreatorRequest } from '../../../../../src/Contexts/apiApp/Authors/application/interfaces';
import { AuthorPrimitives } from '../../../../../src/Contexts/apiApp/Authors/domain/interfaces';
import { BookCreatorRequest } from '../../../../../src/Contexts/apiApp/Books/application/interfaces';
import { BookCreatorRequestMother } from '../../../../Contexts/apiApp/Books/application/mothers';
import { BookPrimitives } from '../../../../../src/Contexts/apiApp/Books/domain/interfaces';
import { CharacterCreatorRequest } from '../../../../../src/Contexts/apiApp/Characters/application/interfaces';
import { CharacterCreatorRequestMother } from '../../../../Contexts/apiApp/Characters/application/mothers';
import { CharacterNameMother } from '../../../../Contexts/apiApp/Characters/domain/mothers';
import { CharacterPrimitives } from '../../../../../src/Contexts/apiApp/Characters/domain/interfaces';
import { SceneCreatorRequestMother } from '../../../../Contexts/apiApp/Scenes/application/mothers';
import { SceneCreatorRequest } from '../../../../../src/Contexts/apiApp/Scenes/application/interfaces';
import { SceneCircumstance } from '../../../../../src/Contexts/apiApp/Scenes/domain';
import { ScenePrimitives } from '../../../../../src/Contexts/apiApp/Scenes/domain/interfaces';
import { App } from 'supertest/types';
import { RegisterUserRequestMother } from '../../../../Contexts/apiApp/Auth/application/mothers';
import { RegisterUserRequest } from '../../../../../src/Contexts/apiApp/Auth/application/interfaces';

type EntityPrimitives =
  | BookPrimitives
  | AuthorPrimitives
  | CharacterPrimitives
  | ScenePrimitives;

const environmentArranger: Promise<EnvironmentArranger> = container.get(
  'apiApp.EnvironmentArranger'
);

const encrypter: EncrypterTool = container.get('plugin.Encrypter');

let _request: request.Test;
let _response: request.Response;
let app: ApiApp;
let httpServer: App; // Agregar esta variable global
let validAdminBearerToken: Nullable<string>;
let validUserBearerToken: Nullable<string>;

const getPayloadByEntity = async (
  entity: string,
  id: string
): Promise<
  | RegisterUserRequest
  | BookCreatorRequest
  | AuthorCreatorRequest
  | CharacterCreatorRequest
  | SceneCreatorRequest
  | StringsMap
> => {
  if (entity === 'actor') {
    const actor = RegisterUserRequestMother.random(id);

    return { ...actor, repeatPassword: actor.password };
  }
  if (entity === 'author') {
    return { id, name: 'test author' };
  }

  if (entity === 'book') {
    const bookRequest = BookCreatorRequestMother.random(id);
    const dependencies = await _createDependenciesByEntity(entity);
    return { ...bookRequest, ...dependencies };
  }

  if (entity === 'character') {
    const { book } = await _createDependenciesByEntity(entity);
    const characterRequest = CharacterCreatorRequestMother.create({
      id: new Uuid(id),
      name: CharacterNameMother.random(),
      book: new Uuid(book)
    });

    return characterRequest;
  }

  if (entity === 'scene') {
    const { character } = await _createDependenciesByEntity(entity);
    const sceneRequest = SceneCreatorRequestMother.create({
      id: new Uuid(id),
      description: new SceneCircumstance(random.word()),
      characters: [new Uuid(character)]
    });
    return sceneRequest;
  }

  return {};
};

const _createDependenciesByEntity = async (
  entity: string
): Promise<StringsMap> => {
  switch (entity) {
    case 'book':
      return await _getBookDependencies();
    case 'character':
      return await _getCharacterDependencies();
    case 'scene':
      return await _getSceneDependencies();
    default:
      return {};
  }
};

const _getBookDependencies = async (): Promise<{ author: string }> => {
  const autor = await getPayloadByEntity('author', Uuid.random().value);
  _request = request(httpServer)
    .post(API_PREFIXES.author)
    .set('Authorization', `Bearer ${validAdminBearerToken}`)
    .send(autor);
  await _request.expect(201);

  return { author: autor?.id };
};

const _getCharacterDependencies = async (): Promise<{ book: string }> => {
  const book = await getPayloadByEntity('book', Uuid.random().value);
  _request = request(httpServer)
    .post(API_PREFIXES.book)
    .set('Authorization', `Bearer ${validAdminBearerToken}`)
    .send(book);

  await _request.expect(201);

  return { book: book?.id };
};

const _getSceneDependencies = async (): Promise<{ character: string }> => {
  const character = await getPayloadByEntity('character', Uuid.random().value);
  _request = request(httpServer)
    .post(API_PREFIXES.character)
    .set('Authorization', `Bearer ${validAdminBearerToken}`)
    .send(character);

  await _request.expect(201);

  return { character: character?.id };
};

const compareResponseObject = <T>(
  responseObj: T,
  expectedObj: Partial<T>
): boolean => {
  return Object.entries(expectedObj).every(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(responseObj, key)) {
      if (typeof value === 'object' && value !== null) {
        return Object.entries(value).every(
          ([subKey, subValue]: [string, unknown]) => {
            const typedSubKey = subKey as keyof typeof value;
            return (
              (responseObj[key as keyof T] as Record<string, unknown>)[
                typedSubKey
              ] === subValue
            );
          }
        );
      } else {
        return responseObj[key as keyof T] === value;
      }
    } else {
      return false;
    }
  });
};

BeforeAll(async () => {
  app = new ApiApp();
  await app.start();
  if (!app.httpServer) {
    throw new Error('httpServer no available');
  }
  httpServer = app.httpServer;
  await (await environmentArranger).arrange();
  validAdminBearerToken = await encrypter.generateToken({
    id: Uuid.random().value,
    email: 'admin@tsapi.com',
    username: UserMother.random().username.value,
    roles: ['admin']
  });
  validUserBearerToken = await encrypter.generateToken({
    id: Uuid.random().value,
    email: 'user@tsapi.com',
    username: UserMother.random().username.value,
    roles: ['user']
  });
});

AfterAll(async () => {
  await (await environmentArranger).arrange();
  await (await environmentArranger).close();
  await app.stop();
});

Given('a GET request to {string}', async (route: string) => {
  _request = request(httpServer).get(route);
});

Given('an authenticated GET request to {string}', async (route: string) => {
  _request = request(httpServer)
    .get(route)
    .set('Authorization', `Bearer ${validUserBearerToken}`);
});

Given(
  'a POST request to {string} with body',
  async (route: string, body: string) => {
    _request = request(httpServer).post(route).send(JSON.parse(body));
  }
);

Given(
  'a POST admin request to {string} with body',
  async (route: string, body: string) => {
    _request = request(httpServer)
      .post(route)
      .set('Authorization', `Bearer ${validAdminBearerToken}`)
      .send(JSON.parse(body));
  }
);

Given(
  'a POST user request to {string} with body',
  async (route: string, body: string) => {
    _request = request(httpServer)
      .post(route)
      .set('Authorization', `Bearer ${validUserBearerToken}`)
      .send(JSON.parse(body));
  }
);

Given(
  'an invalid token POST request to {string} with body',
  async (route: string, body: string) => {
    _request = request(httpServer)
      .post(route)
      .set('Authorization', `${random.word()}`)
      .send(JSON.parse(body));
  }
);

Given(
  'a nullish token POST request to {string} with body',
  async (route: string, body: string) => {
    _request = request(httpServer)
      .post(route)
      .set('Authorization', `Bearer ${random.word()}`)
      .send(JSON.parse(body));
  }
);

Given(
  'a PATCH request to {string} with body',
  async (route: string, body: string) => {
    _request = request(httpServer).patch(route).send(JSON.parse(body));
  }
);

Given(
  'a PATCH admin request to {string} with body',
  async (route: string, body: string) => {
    _request = request(httpServer)
      .patch(route)
      .set('Authorization', `Bearer ${validAdminBearerToken}`)
      .send(JSON.parse(body));
  }
);

Given('a DELETE request to {string}', async (route: string) => {
  _request = request(httpServer).delete(route);
});

Given('a DELETE admin request to {string}', async (route: string) => {
  _request = request(httpServer)
    .delete(route)
    .set('Authorization', `Bearer ${validAdminBearerToken}`);
});

Given(
  'an existing {string} with id {string}',
  async (entity: string, id: string) => {
    const entityKey = entity === 'actor' ? 'auth' : entity;
    const prefix =
      entityKey === 'auth'
        ? `${API_PREFIXES[entityKey]}/register`
        : API_PREFIXES[entityKey];

    _request = request(httpServer)
      .post(prefix)
      .set('Authorization', `Bearer ${validAdminBearerToken}`)
      .send(await getPayloadByEntity(entity, id));

    await _request.expect(201);
  }
);

Then('the response status code should be {int}', async (status: number) => {
  _response = await _request.expect(status);
});

Then('the response body should be', async (docString: string) => {
  assert.deepStrictEqual(_response.body, JSON.parse(docString));
});

Then('the field {string} should be populated', async (fieldPath: string) => {
  const response = await _request;

  // Función para obtener valores anidados sin usar eval ni any
  function getNestedValue(obj: unknown, path: string): unknown {
    const pathArray = path.split('.');

    return pathArray.reduce((acc, key) => {
      const arrayMatch = /^(\w+)\[(\d+)]$/.exec(key);

      if (arrayMatch) {
        const [_, arrayKey, index] = arrayMatch;
        const record = acc as Record<string, unknown>;
        if (Array.isArray(record[arrayKey])) {
          return (record[arrayKey] as unknown[])[parseInt(index, 10)];
        }
        return undefined;
      }

      return (acc as Record<string, unknown>)?.[key];
    }, obj);
  }

  const data = Array.isArray(response.body) ? response.body[0] : response.body;
  const fieldValue = getNestedValue(data, fieldPath);

  expect(fieldValue).to.exist;
  expect(typeof fieldValue).to.equal('object');
  expect(
    fieldValue &&
      typeof fieldValue === 'object' &&
      Object.keys(fieldValue).length
  ).to.be.greaterThan(0);
});

Then('the response body should contain', async (docString: string) => {
  const response = await _request;
  const expectedResponseBody: Partial<BookPrimitives | AuthorPrimitives> =
    JSON.parse(docString);

  const matches = compareResponseObject(response.body, expectedResponseBody);

  assert.isTrue(
    matches,
    'Expected response body to match the expected response body'
  );
});

Then(
  'the response body will be an array containing',
  async (docString: string) => {
    const response = await _request;
    const expectedResponseBody: Partial<EntityPrimitives> =
      JSON.parse(docString);
    assert.isArray(response.body);

    const matches = response.body.some(
      (item: BookPrimitives | AuthorPrimitives) =>
        compareResponseObject(item, expectedResponseBody)
    );

    assert.isTrue(
      matches,
      'Expected response body to include an item matching the expected response body'
    );
  }
);

Then('the response body will match', async (docString: string) => {
  const response = await _request;
  const expectedResponseBody = JSON.parse(docString);
  assert.deepNestedInclude(response.body, expectedResponseBody);
});

Then(
  'the response body should have the properties:',
  async (dataTable: DataTable) => {
    const response = await _request;
    const expectedProperties = dataTable.raw().flat();

    for (const key of expectedProperties) {
      assert.property(
        response.body,
        key,
        `Response should have property: ${key}`
      );
    }
  }
);

Then('the response body should include an auth token', async () => {
  assert.isNotEmpty(_response.body.token);
});

Then('the response body should be empty', async () => {
  assert.isEmpty(_response.body);
});
