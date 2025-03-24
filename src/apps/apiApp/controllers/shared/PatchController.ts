import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../shared/interfaces';

interface PatchService<TPayload> {
  run(payload: TPayload, user: { username: string; id: string }): Promise<void>;
}

export abstract class PatchController<
  TService extends PatchService<TPayload>,
  TPayload extends Record<string, unknown>
> implements Controller
{
  constructor(protected readonly service: TService) {}

  abstract run(req: Request, res: Response, next: NextFunction): Promise<void>;
}
