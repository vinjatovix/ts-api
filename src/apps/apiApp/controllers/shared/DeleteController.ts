import { NextFunction, Request, Response } from 'express';
import { Controller } from '../../shared/interfaces';

interface DeleteService {
  run(
    { id }: { id: string },
    user: { username: string; id: string }
  ): Promise<void>;
}

export abstract class DeleteController<TService extends DeleteService>
  implements Controller
{
  constructor(protected readonly service: TService) {}

  abstract run(req: Request, res: Response, next: NextFunction): Promise<void>;
}
