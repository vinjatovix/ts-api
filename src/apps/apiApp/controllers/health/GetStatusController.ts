import { Request, Response } from 'express';
import { Controller } from '../../shared/interfaces';
import { version } from '../../../../../package.json';

export class GetStatusController implements Controller {
  async run(_req: Request, res: Response): Promise<void> {
    res.status(200).json({ version, status: 'OK' });
  }
}
