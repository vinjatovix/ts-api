import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../shared/interfaces';

interface PostService<TPayload> {
  run(payload: TPayload, username: string): Promise<void>;
}

export abstract class PostController<
  TService extends PostService<TPayload>,
  TPayload extends Record<string, unknown>
> implements Controller
{
  constructor(protected readonly service: TService) {}

  abstract run(req: Request, res: Response, next: NextFunction): Promise<void>;
}
