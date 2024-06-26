import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import express from 'express';
import Router from 'express-promise-router';
import helmet from 'helmet';
import * as http from 'http';
import cors from 'cors';
import { registerRoutes } from './routes';
import { apiErrorHandler } from './routes/shared';
import { buildLogger } from '../../Contexts/shared/plugins/logger.plugin';
import { envs } from '../../config/plugins/envs.plugin';
import migrations from '../../../migrations';
const corsOptions = {
  origin: envs.ALLOWED_ORIGINS?.split(',') ?? [],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

const logger = buildLogger('apiApp');

export class Server {
  private express: express.Express;
  private port: number;
  private host: string;
  private httpServer?: http.Server;

  constructor(host: string, port: number) {
    migrations.up();
    this.port = port;
    this.host = host;
    this.express = express();
    this.express.use(cors(corsOptions));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(helmet.xssFilter());
    this.express.use(helmet.noSniff());
    this.express.use(helmet.hidePoweredBy());
    this.express.use(helmet.frameguard({ action: 'deny' }));
    const router = Router();
    router.use(errorHandler());
    this.express.use(router);

    registerRoutes(router);

    router.use(apiErrorHandler);
  }

  async listen(): Promise<void> {
    return new Promise((resolve) => {
      const env: string = this.express.get('env');
      this.httpServer = this.express.listen(this.port, () => {
        const host = ['local', 'test'].includes(env)
          ? `${this.host}:${this.port}`
          : this.host;
        const message: string = `Backend App is running at ${host} in ${env} mode`;
        logger.info(message);
        resolve();
      });
    });
  }

  getHTTPServer() {
    return this.httpServer;
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
