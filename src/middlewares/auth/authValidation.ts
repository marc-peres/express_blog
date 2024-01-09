import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../../common/models';
import { envVariables } from '../../common/env';

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

  if (!envVariables.basicAuthLogin || !envVariables.basicAuthPassword) {
    throw new Error(` ! AUTH_PASSWORD or AUTH_LOGIN doesn't found`);
  }

  if (login !== envVariables.basicAuthLogin || password !== envVariables.basicAuthPassword) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }
  next();
};
