import { NextFunction, Request, Response } from 'express';
import { Controller, RequestOptions } from '../../shared/interfaces';

interface GetAllService<TOptions, TResult> {
  run(options: TOptions): Promise<TResult>;
}

export abstract class GetAllController<
  TService extends GetAllService<TOptions, TResult>,
  TOptions extends Partial<RequestOptions>,
  TResult
> implements Controller
{
  constructor(protected readonly service: TService) {}

  abstract run(req: Request, res: Response, next: NextFunction): Promise<void>;
}
