import { NextFunction, Request, Response } from 'express';
import { EnsureAuthentication } from './EnsureAuthentication';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  EnsureAuthentication.run(req, res, next);
};
