import { AfterAll, BeforeAll, Given, Then } from '@cucumber/cucumber';
import { assert } from 'chai';
import request from 'supertest';

import { ApiApp } from '../../../../../src/apps/apiApp/ApiApp';
import container from '../../../../../src/apps/apiApp/dependency-injection';

import { EnvironmentArranger } from '../../../../Contexts/shared/infrastructure/arranger/EnvironmentArranger';
import { EncrypterTool } from '../../../../../src/Contexts/shared/plugins/EncrypterTool';
import { Nullable } from '../../../../../src/Contexts/shared/domain/Nullable';
import { Uuid } from '../../../../../src/Contexts/shared/domain/value-object/Uuid';
import { random } from '../../../../Contexts/fixtures/shared';

const environmentArranger: Promise<EnvironmentArranger> = container.get(
  'apiApp.EnvironmentArranger'
);

const encrypter: EncrypterTool = container.get('plugin.Encrypter');

let _request: request.Test;
let _response: request.Response;
let app: ApiApp;
let validAdminBearerToken: Nullable<string>;
let validUserBearerToken: Nullable<string>;

BeforeAll(async () => {
  app = new ApiApp();
  await app.start();
  await (await environmentArranger).arrange();
  validAdminBearerToken = await encrypter.generateToken({
    id: Uuid.random().value,
    email: 'admin@tsapi.com',
    username: random.word(),
    roles: ['admin']
  });
  validUserBearerToken = await encrypter.generateToken({
    id: Uuid.random().value,
    email: 'user@tsapi.com',
    username: random.word(),
    roles: ['user']
  });
});

AfterAll(async () => {
  await (await environmentArranger).arrange();
  await (await environmentArranger).close();
  await app.stop();
});

Given('a GET request to {string}', async (route: string) => {
  _request = request(app.httpServer).get(route);
});

Given('an authenticated GET request to {string}', async (route: string) => {
  _request = request(app.httpServer)
    .get(route)
    .set('Authorization', `Bearer ${validUserBearerToken}`);
});

Given(
  'a POST request to {string} with body',
  async (route: string, body: string) => {
    _request = request(app.httpServer).post(route).send(JSON.parse(body));
  }
);

Given(
  'a POST admin request to {string} with body',
  async (route: string, body: string) => {
    _request = request(app.httpServer)
      .post(route)
      .set('Authorization', `Bearer ${validAdminBearerToken}`)
      .send(JSON.parse(body));
  }
);

Given(
  'a POST user request to {string} with body',
  async (route: string, body: string) => {
    _request = request(app.httpServer)
      .post(route)
      .set('Authorization', `Bearer ${validUserBearerToken}`)
      .send(JSON.parse(body));
  }
);

Given(
  'an invalid token POST request to {string} with body',
  async (route: string, body: string) => {
    _request = request(app.httpServer)
      .post(route)
      .set('Authorization', `${random.word()}`)
      .send(JSON.parse(body));
  }
);

Given(
  'a nullish token POST request to {string} with body',
  async (route: string, body: string) => {
    _request = request(app.httpServer)
      .post(route)
      .set('Authorization', `Bearer ${random.word()}`)
      .send(JSON.parse(body));
  }
);

Given(
  'a PATCH request to {string} with body',
  async (route: string, body: string) => {
    _request = request(app.httpServer).patch(route).send(JSON.parse(body));
  }
);

Given(
  'a PATCH admin request to {string} with body',
  async (route: string, body: string) => {
    _request = request(app.httpServer)
      .patch(route)
      .set('Authorization', `Bearer ${validAdminBearerToken}`)
      .send(JSON.parse(body));
  }
);

Given('a DELETE request to {string}', async (route: string) => {
  _request = request(app.httpServer).delete(route);
});

Given('a DELETE admin request to {string}', async (route: string) => {
  _request = request(app.httpServer)
    .delete(route)
    .set('Authorization', `Bearer ${validAdminBearerToken}`);
});

Then('the response status code should be {int}', async (status: number) => {
  _response = await _request.expect(status);
});

Then('the response body should be', async (docString: string) => {
  assert.deepStrictEqual(_response.body, JSON.parse(docString));
});

Then('the response body should contain', async (docString: string) => {
  const response = await _request;
  const expectedResponseBody = JSON.parse(docString);
  assert.include(response.body, expectedResponseBody);
});

Then(
  'the response body will be an array containing',
  async (docString: string) => {
    const response = await _request;
    const expectedResponseBody = JSON.parse(docString);
    assert.isArray(response.body);
    assert.deepNestedInclude(response.body, expectedResponseBody);
  }
);

Then('the response body should include an auth token', async () => {
  assert.isNotEmpty(_response.body.token);
});

Then('the response body should be empty', async () => {
  assert.isEmpty(_response.body);
});
