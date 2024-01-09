import { basicAuthMiddleware } from '../../../middlewares/auth/basicAuthMiddleware';
import { formattedErrorsValidation } from '../../../common/validators';
import { body } from 'express-validator';

export const loginValidation = body('login')
  .isString()
  .trim()
  .isLength({ min: 3, max: 10 })
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage('Invalid login!');

export const passwordValidation = body('password').isString().trim().isLength({ min: 6, max: 20 }).withMessage('Invalid password!');

export const emailValidation = body('email')
  .isString()
  .trim()
  .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage('Invalid email!');

export const postUserValidation = () => [
  basicAuthMiddleware,
  loginValidation,
  passwordValidation,
  emailValidation,
  formattedErrorsValidation,
];

export const queryUsersValidator = () => [basicAuthMiddleware, formattedErrorsValidation];
