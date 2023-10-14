import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import express, { Request, Response, NextFunction } from 'express';
import Router from 'express-promise-router';
import helmet from 'helmet';
import * as http from 'http';
import httpStatus from 'http-status';
import cors from 'cors';
import { registerRoutes } from './routes';

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

export class Server {
  private express: express.Express;
  private port: string;
  private host: string;
  private httpServer?: http.Server;

  constructor(host: string, port: string) {
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

    router.use(
      (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
        console.log(err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
      }
    );
  }

  async listen(): Promise<void> {
    return new Promise((resolve) => {
      const env: string = this.express.get('env');
      this.httpServer = this.express.listen(this.port, () => {
        const host = ['local', 'test'].includes(env)
          ? `${this.host}:${this.port}`
          : this.host;
        const message: string = `Backend App is running at ${host} in ${env} mode`;
        console.log(message);
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
