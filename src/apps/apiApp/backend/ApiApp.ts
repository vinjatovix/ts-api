import { Server } from './server';

export class ApiApp {
  server?: Server;
  host?: string;

  async start() {
    const host: string = process.env.HOST ?? 'http://localhost';
    const port: string = process.env.PORT ?? '0';
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
