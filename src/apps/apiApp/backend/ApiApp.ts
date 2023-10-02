import { Server } from './server';

export class ApiApp {
  server?: Server;

  async start() {
    const port: string = process.env.PORT ?? '0';
    this.server = new Server(port);

    return this.server.listen();
  }

  async stop() {
    return this.server?.stop();
  }

  get httpServer() {
    return this.server?.getHTTPServer();
  }
}
