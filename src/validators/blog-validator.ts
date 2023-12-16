import { body } from 'express-validator';
import { inputValidation } from '../middlewares/input-model-validation/input-validation';
import { authValidation } from '../middlewares/auth/auth-validation';

export const nameValidation = body('name').isString().trim().isLength({ min: 1, max: 15 }).withMessage('Invalid name!');
export const descriptionValidation = body('description')
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage('Invalid description!');
export const websiteUrlValidation = body('websiteUrl')
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 })
  .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  .withMessage('Invalid websiteUrl!');

export const blogPostValidation = () => [authValidation, nameValidation, descriptionValidation, websiteUrlValidation, inputValidation];
