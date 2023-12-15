import { Server } from '../../../src/apps/apiApp/server';
import { envs } from '../../../src/config/plugins/envs.plugin';

jest.mock('../../../src/apps/apiApp/server');

describe('ApiApp', () => {
  it('should start', async () => {
    await import('../../../src/apps/apiApp/start');
    expect(Server).toHaveBeenCalledTimes(1);
    expect(Server).toHaveBeenCalledWith(envs.HOST, envs.PORT);
  });
});
