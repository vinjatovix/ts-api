import { AfterAll, BeforeAll, Given, Then } from '@cucumber/cucumber';
import { assert } from 'chai';
import request from 'supertest';

import { ApiApp } from '../../../../../src/apps/apiApp/ApiApp';
import container from '../../../../../src/apps/apiApp/dependency-injection';

import { EnvironmentArranger } from '../../../../Contexts/shared/infrastructure/arranger/EnvironmentArranger';

const environmentArranger: Promise<EnvironmentArranger> = container.get(
  'apiApp.EnvironmentArranger'
);

let _request: request.Test;
let _response: request.Response;
let app: ApiApp;

BeforeAll(async () => {
  app = new ApiApp();
  await app.start();
  await (await environmentArranger).arrange();
});

AfterAll(async () => {
  await (await environmentArranger).arrange();
  await (await environmentArranger).close();
  await app.stop();
});

Given('a GET request to {string}', async (route: string) => {
  _request = request(app.httpServer).get(route);
});

Given(
  'a POST request to {string} with body',
  async (route: string, body: string) => {
    _request = request(app.httpServer).post(route).send(JSON.parse(body));
  }
);

Given(
  'a PATCH request to {string} with body',
  async (route: string, body: string) => {
    _request = request(app.httpServer).patch(route).send(JSON.parse(body));
  }
);

Given('a DELETE request to {string}', async (route: string) => {
  _request = request(app.httpServer).delete(route);
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

Then('the response body should be empty', async () => {
  assert.isEmpty(_response.body);
});
