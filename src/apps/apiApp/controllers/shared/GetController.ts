import { NextFunction, Request, Response } from 'express';
import { Controller, RequestOptions } from '../../shared/interfaces';

interface GetService<TOptions, TResult> {
  run({ id }: { id: string }, options: TOptions): Promise<TResult>;
}

export abstract class GetController<
  TService extends GetService<TOptions, TResult>,
  TOptions extends Partial<RequestOptions>,
  TResult
> implements Controller
{
  constructor(protected readonly service: TService) {}

  abstract run(req: Request, res: Response, next: NextFunction): Promise<void>;
}
