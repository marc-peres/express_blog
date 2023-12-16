import { param } from 'express-validator';
import { inputValidation } from '../middlewares/input-model-validation/input-validation';

export const idValidation = param('id')
  .isString()
  .trim()
  .custom(id => !isNaN(id))
  .withMessage('Invalid id');

export const idValid = () => [idValidation, inputValidation];
