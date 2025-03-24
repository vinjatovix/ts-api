import { Controller, RequestOptions } from '../../shared/interfaces';
import { NextFunction, Request, Response } from 'express';

import { getOptions } from './getOptions';
import httpStatus from 'http-status';

interface DeleteService {
  run(
    { id }: { id: string },
    user: { username: string; id: string }
  ): Promise<void>;
}

export function createDeleteController<TService extends DeleteService>(
  service: TService
): Controller {
  return {
    async run(req, res, next) {
      try {
        const { id } = req.params;
        const user = res.locals.user;

        await service.run({ id }, user);

        res.status(httpStatus.NO_CONTENT).send();
      } catch (error) {
        next(error);
      }
    }
  };
}

interface GetAllService<TOptions, TResult> {
  run(options: TOptions): Promise<TResult>;
}

export function createGetAllController<
  TService extends GetAllService<TOptions, TResult>,
  TOptions extends Partial<RequestOptions>,
  TResult
>(service: TService): Controller {
  return {
    async run(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const options: TOptions = getOptions(req) as TOptions;
        const data: TResult = await service.run(options);

        res.status(httpStatus.OK).send(data);
      } catch (error: unknown) {
        next(error);
      }
    }
  };
}

interface GetService<TOptions, TResult> {
  run({ id }: { id: string }, options: TOptions): Promise<TResult>;
}

export function createGetController<
  TService extends GetService<TOptions, TResult>,
  TOptions extends Partial<RequestOptions>,
  TResult
>(service: TService): Controller {
  return {
    async run(req, res, next) {
      try {
        const options: TOptions = getOptions(req) as TOptions;
        const data: TResult = await service.run({ id: req.params.id }, options);

        res.status(httpStatus.OK).send(data);
      } catch (error: unknown) {
        next(error);
      }
    }
  };
}

interface PatchService<TPayload> {
  run(payload: TPayload, username: string): Promise<void>;
}

export function createPatchController<TService, TPayload>(
  service: TService
): Controller {
  return {
    async run(req, res, next) {
      try {
        const { id } = req.params;
        const updates = req.body;
        const user = res.locals.user;

        await (service as PatchService<TPayload>).run({ id, ...updates }, user);

        res.status(httpStatus.OK).send();
      } catch (error) {
        next(error);
      }
    }
  };
}

interface PostService<TPayload> {
  run(payload: TPayload, username: string): Promise<void>;
}

export function createPostController<TService, TPayload>(
  service: TService
): Controller {
  return {
    async run(req, res, next) {
      try {
        const username = res.locals.user.username;

        await (service as PostService<TPayload>).run(req.body, username);

        res.status(httpStatus.CREATED).send();
      } catch (error) {
        next(error);
      }
    }
  };
}
