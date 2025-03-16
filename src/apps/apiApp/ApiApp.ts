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

    return this.server.listen();
  }

  async stop() {
    return this.server?.stop();
  }

  get httpServer() {
    return this.server?.getHTTPServer();
  }
}
