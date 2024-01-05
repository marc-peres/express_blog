import { body } from 'express-validator';
import { formattedErrorsValidation } from '../../../common/validators';

export const loginOrEmailValidation = body('loginOrEmail')
  .isString()
  .trim()
  .custom(val => !!val.length)
  .withMessage('Invalid loginOrEmail!');

export const passwordValidation = body('password')
  .isString()
  .trim()
  .custom(val => !!val.length)
  .withMessage('Invalid password!');

export const postUserValidation = () => [loginOrEmailValidation, passwordValidation, formattedErrorsValidation];
