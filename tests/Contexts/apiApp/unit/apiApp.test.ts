import { ApiApp } from '../../../../src/apps/apiApp/ApiApp';
import { Server } from '../../../../src/apps/apiApp/server';

describe('ApiApp', () => {
  let apiApp: ApiApp;
  const listenSpy = jest.spyOn(Server.prototype, 'listen');
  const stopSpy = jest.spyOn(Server.prototype, 'stop');

  beforeAll(() => {
    apiApp = new ApiApp();
  });

  afterEach(async () => {
    if (apiApp.httpServer?.listening) {
      await apiApp.stop();
    }
  });

  it('should start the server', async () => {
    await apiApp.start();

    expect(listenSpy).toHaveBeenCalled();
  });

  it('should stop the server', async () => {
    await apiApp.start();

    await apiApp.stop();

    expect(stopSpy).toHaveBeenCalled();
  });

  it('should return the HTTP server', async () => {
    await apiApp.start();

    const httpServer = apiApp.httpServer;

    expect(httpServer).toBeDefined();
  });
});
