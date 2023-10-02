import request from 'supertest';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import { ApiApp } from '../../../../../../src/apps/apiApp/backend/ApiApp';

let app: ApiApp;

describe('Health Check Endpoint', () => {
  beforeAll(async () => {
    app = new ApiApp();
    await app.start();
  });

  afterAll(async () => {
    await app.stop();
  });

  it('should return status 200 and "OK"', async () => {
    const { status, body } = await request(app.httpServer).get(
      '/api/v1/health/http'
    );

    expect(status).toBe(200);
    expect(body).toMatchObject({ status: 'OK' });
  });
});
