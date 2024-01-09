import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../../common/models';
import { JwtService } from '../../application/services/jwtService';
import { UserQueryRepository } from '../../modules/users/repositories/userQueryRepository';

export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers['authorization'];

  if (!auth) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }

  const [, token] = auth.split(' ');
  const userId = await JwtService.getUserIdByToken(token);
  // ????? Нужно ли здесь проверять юзера

  if (!userId) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }
  const user = await UserQueryRepository.findUserByFilter({ _id: userId });

  if (!user) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }
  // if user exist
  req.user = user;
  next();
};
