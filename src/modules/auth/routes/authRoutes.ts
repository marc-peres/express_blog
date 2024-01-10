import { Response, Router, Request } from 'express';
import { HTTP_STATUSES, RequestWithBodyType } from '../../../common/models';
import { InputLoginAuthType } from '../models/input';
import { postUserValidation } from '../validation/authValidation';
import { AuthService } from '../service/authService';
import { bearerAuthMiddleware } from '../../../middlewares/auth/bearerAuthMiddleware';
import { JwtService } from '../../../application/services/jwtService';

export const authRoute = Router({});

authRoute.post('/login', postUserValidation(), async (req: RequestWithBodyType<InputLoginAuthType>, res: Response) => {
  const { loginOrEmail, password } = req.body;
  const user = await AuthService.checkCredentials(loginOrEmail, password);

  if (!user || !user._id) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }
  const tokenJWT = await JwtService.createJWT(user!);
  res.send(tokenJWT);
});
authRoute.get('/me', bearerAuthMiddleware, async (req: Request, res: Response) => {
  const user = req.user!;
  res.send({ email: user.email, login: user.login, userId: user._id });
});
