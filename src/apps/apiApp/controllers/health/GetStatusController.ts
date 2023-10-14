import { Request, Response } from 'express';
import { Controller } from '../../shared/interfaces/Controller';

export class GetStatusController implements Controller {
  async run(_req: Request, res: Response): Promise<void> {
    res.status(200).json({ status: 'OK' });
  }
}
