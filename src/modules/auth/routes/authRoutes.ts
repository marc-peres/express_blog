import { Response, Router, Request } from 'express';
import { HTTP_STATUSES, RequestWithBodyType } from '../../../common/models';
import { InputConfirmAuthType, InputLoginAuthType, InputRegistrationAuthType, InputResendEmailAuthType } from '../models/input';
import {
  postAuthLoginValidation,
  postAuthRegistrationValidation,
  registrationConfirmationValidation,
  registrationEmailResendingValidation,
} from '../validation/authValidation';
import { AuthService } from '../service/authService';
import { bearerAuthMiddleware } from '../../../middlewares/auth/bearerAuthMiddleware';
import { JwtService } from '../../../application/services/jwtService';
import { authRepository } from '../repository/authRepository';
export const authRoute = Router({});

authRoute.post('/login', postAuthLoginValidation(), async (req: RequestWithBodyType<InputLoginAuthType>, res: Response) => {
  const { loginOrEmail, password } = req.body;
  const user = await AuthService.checkCredentials(loginOrEmail, password);

  if (!user || !user._id) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }
  const { refreshToken, accessToken } = await JwtService.createJWT(user._id, user.email, user.login);
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  res.send({ accessToken });
});

authRoute.post('/refresh-token', async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }
  const result = await AuthService.refreshTokens(oldRefreshToken);

  if (!result) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }
  const { refreshToken, accessToken } = result;
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  res.send({ accessToken });
});

authRoute.post('/logout', async (req: Request, res: Response) => {
  const cookieRefreshToken = req.cookies.refreshToken;
  if (!cookieRefreshToken) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }
  const result = await AuthService.logOut(cookieRefreshToken);
  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
});

authRoute.post(
  '/registration',
  postAuthRegistrationValidation(),
  async (req: RequestWithBodyType<InputRegistrationAuthType>, res: Response) => {
    const { login, password, email } = req.body;
    const user = await authRepository.registrationWithConfirm(email, login, password);
    user ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
  },
);

authRoute.post(
  '/registration-confirmation',
  registrationConfirmationValidation(),
  async (req: RequestWithBodyType<InputConfirmAuthType>, res: Response) => {
    const { code } = req.body;
    const result = await authRepository.confirmationEmailByCode(code);
    result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
  },
);

authRoute.post(
  '/registration-email-resending',
  registrationEmailResendingValidation(),
  async (req: RequestWithBodyType<InputResendEmailAuthType>, res: Response) => {
    const { email } = req.body;
    const result = await AuthService.resendingConfirm(email);
    result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
  },
);

authRoute.get('/me', bearerAuthMiddleware, async (req: Request, res: Response) => {
  const auth = req.headers['authorization'];
  const [, token] = auth!.split(' ');
  const result = await JwtService.getUserInfoByToken(token, 'access');

  result
    ? res.send({ email: result.email, login: result.login, userId: result.userId.toString() })
    : res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
});
