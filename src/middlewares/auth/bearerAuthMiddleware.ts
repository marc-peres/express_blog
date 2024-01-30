import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../../common/models';
import { JwtService } from '../../application/services/jwtService';
import { UserQueryRepository } from '../../modules/users/repositories/userQueryRepository';
import { AuthQueryRepository } from '../../modules/auth/repository/authQueryRepository';

export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers['authorization'];

  if (!auth) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }

  const [, token] = auth.split(' ');
  const result = await JwtService.getUserInfoByToken(token, 'access');

  if (!result) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }
  const { userId } = result;
  // проверка есть ли токен в блэк-листе
  const isTokenExpired = await AuthQueryRepository.findTokenInBlackList({ expiredToken: token });
  if (isTokenExpired) {
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
