import { Request, Response } from 'express';
import { Controller } from '../../shared/interfaces/Controller';
import httpStatus from 'http-status';


export class GetStatusController implements Controller {
  async run(_req: Request, res: Response): Promise<void> {
    res.status(httpStatus.OK).json({ status: 'OK' });
  }
}
