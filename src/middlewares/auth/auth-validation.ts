import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { HTTP_STATUSES } from '../../models/common';

dotenv.config();
export const authValidation = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers['authorization'];

  if (!auth) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }

  const [basic, token] = auth.split(' ');

  if (basic !== 'Basic') {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }

  const decodeAuth = Buffer.from(token, 'base64').toString();
  const [login, password] = decodeAuth.split(':');

  if (!process.env.AUTH_LOGIN || !process.env.AUTH_PASSWORD) {
    throw new Error(` ! AUTH_PASSWORD or AUTH_LOGIN doesn't found`);
  }

  if (login !== process.env.AUTH_LOGIN || password !== process.env.AUTH_PASSWORD) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }
  next();
};
