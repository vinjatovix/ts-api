import { Request } from 'express';
import { RequestOptions } from '../../shared/interfaces';

export const getOptions = (req: Request): Partial<RequestOptions> => {
  const { include, fields } = req.query || {};

  return {
    ...(include && { include: include as string[] }),
    ...(fields && { fields: fields as string[] })
  };
};
