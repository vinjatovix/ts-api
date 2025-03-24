import { envs } from '../../config/plugins';
import { Server } from './server';

export class ApiApp {
  server?: Server;
  host?: string;

  async start() {
    const host: string = envs.HOST;
    const port: number = envs.PORT;
    this.host = host;
    this.server = new Server(host, port);

    await this.server.listen();
    return this.server;
  }

  async stop() {
    return this.server?.stop();
  }

  get httpServer() {
    if (!this.server) {
      throw new Error('Server is not initialized');
    }
    return this.server.getHTTPServer();
  }
}
