import { param } from 'express-validator';
import { formattedErrorsValidation } from './formatted-errors-validation';

export const idValidation = param('id').isString().trim().notEmpty().withMessage('Invalid id');

export const idValid = () => [idValidation, formattedErrorsValidation];
