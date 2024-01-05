import { param } from 'express-validator';
import { formattedErrorsValidation } from './formattedErrorsValidation';

export const idValidation = param('id').isString().trim().notEmpty().withMessage('Invalid id');

export const idValid = () => [idValidation, formattedErrorsValidation];
