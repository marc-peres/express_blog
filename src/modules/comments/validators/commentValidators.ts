import { body } from 'express-validator';
import { formattedErrorsValidation } from '../../../common/validators';

export const commentContentValidator = body('content').isString().trim().isLength({ min: 20, max: 300 }).withMessage('Invalid content!');

export const putCommentValidation = () => [commentContentValidator, formattedErrorsValidation];
