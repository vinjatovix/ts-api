import { AfterAll, BeforeAll, Given, Then } from '@cucumber/cucumber';
import request from 'supertest';

import chai from 'chai';
import { ApiApp } from '../../../../../src/apps/apiApp/ApiApp';

const expect = chai.expect;
let _request: request.Test;
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

Then('the response status code should be {int}', async (status: number) => {
  const response = await _request;
  expect(response.status).to.be.equal(status);
});

Then('the response body should be', async (docString: string) => {
  const response = await _request;
  const expectedResponseBody = JSON.parse(docString);
  expect(response.body).to.deep.equal(expectedResponseBody);
});

Then('the response body should not be', async (docString: string) => {
  const response = await _request;
  const expectedResponseBody = JSON.parse(docString);
  expect(response.body).to.not.deep.equal(expectedResponseBody);
});
