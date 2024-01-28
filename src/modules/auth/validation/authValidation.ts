import { body } from 'express-validator';
import { formattedErrorsValidation } from '../../../common/validators';
import { UserQueryRepository } from '../../users/repositories/userQueryRepository';

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

export const postAuthLoginValidation = () => [loginOrEmailValidation, passwordValidation, formattedErrorsValidation];

export const confirmCodeValidation = body('code')
  .isString()
  .trim()
  .isLength({ min: 1 })
  .custom(async value => {
    const user = await UserQueryRepository.findUserByFilter({ 'emailConfirmation.confirmationCode': value });
    if (!user || user.emailConfirmation.isConfirmed) {
      throw Error('Invalid blogId!');
    }
    return true;
  })
  .withMessage('Invalid code!');
export const registrationLoginValidation = body('login')
  .isString()
  .trim()
  .isLength({ min: 3, max: 10 })
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage('Invalid login!');

export const registrationLoginExistValidation = body('login')
  .isString()
  .trim()
  .isLength({ min: 3, max: 10 })
  .matches(/^[a-zA-Z0-9_-]*$/)
  .custom(async value => {
    const user = await UserQueryRepository.findUserByFilter({ login: value });
    if (user) {
      throw Error('Invalid blogId!');
    }
    return true;
  })
  .withMessage('Invalid login!');
export const registrationPasswordValidation = body('password')
  .isString()
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage('Invalid password!');
export const registrationEmailValidation = body('email')
  .isString()
  .trim()
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage('Invalid email!');

export const registrationEmailExistValidation = body('email')
  .isString()
  .trim()
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .custom(async value => {
    const user = await UserQueryRepository.findUserByFilter({ email: value });
    if (user) {
      throw Error('Invalid blogId!');
    }
    return true;
  })
  .withMessage('Invalid email!');
export const registrationEmailNOTExistValidation = body('email')
  .isString()
  .trim()
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .custom(async value => {
    const user = await UserQueryRepository.findUserByFilter({ email: value });
    if (!user || user.emailConfirmation.isConfirmed) {
      throw Error('Invalid blogId!');
    }
    return true;
  })
  .withMessage('Invalid email!');
export const postAuthRegistrationValidation = () => [
  registrationLoginValidation,
  registrationPasswordValidation,
  registrationEmailValidation,
  registrationEmailExistValidation,
  registrationLoginExistValidation,
  formattedErrorsValidation,
];
export const registrationConfirmationValidation = () => [confirmCodeValidation, formattedErrorsValidation];
export const registrationEmailResendingValidation = () => [registrationEmailNOTExistValidation, formattedErrorsValidation];
