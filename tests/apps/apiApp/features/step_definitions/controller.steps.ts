import { AfterAll, BeforeAll, Given, Then } from '@cucumber/cucumber';
import request from 'supertest';
import { assert } from 'chai';
import { ApiApp } from '../../../../../src/apps/apiApp/ApiApp';

let _request: request.Test;
let _response: request.Response;
let app: ApiApp;

BeforeAll(async () => {
  app = new ApiApp();
  await app.start();
});

AfterAll(async () => {
  await app.stop();
});

Given('a GET request to {string}', (route: string) => {
  _request = request(app.httpServer).get(route);
});

Given(
  'a PUT request to {string} with body',
  async (route: string, body: string) => {
    _request = request(app.httpServer).put(route).send(JSON.parse(body));
  }
);

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

Then('the response body should be empty', async () => {
  assert.isEmpty(_response.body);
});
