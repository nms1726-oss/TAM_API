import { Response, Request } from 'express';

export const healthCheck = (_req: Request, res: Response): Response => {
  return res.json({ status: 'OK' });
};