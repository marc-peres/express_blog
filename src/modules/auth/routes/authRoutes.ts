import { Response, Router } from 'express';
import { HTTP_STATUSES, RequestWithBodyType } from '../../../common/models';
import { InputLoginAuthType } from '../models/input';
import { postUserValidation } from '../validation/authValidation';
import { AuthService } from '../service/authService';

export const authRoute = Router({});

authRoute.post('/login', postUserValidation(), async (req: RequestWithBodyType<InputLoginAuthType>, res: Response) => {
  const { loginOrEmail, password } = req.body;
  const hasUser = await AuthService.checkCredentials(loginOrEmail, password);
  hasUser ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
});
