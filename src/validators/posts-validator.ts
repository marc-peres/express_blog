import { body } from 'express-validator';
import { formattedErrorsValidation } from './formatted-errors-validation';
import { authValidation } from '../middlewares/auth/auth-validation';
import { BlogRepository } from '../repositories';
import { ObjectId } from 'mongodb';

export const postTitleValidation = body('title').isString().trim().isLength({ min: 1, max: 30 }).withMessage('Invalid title!');
export const postShortDescriptionValidation = body('shortDescription')
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Invalid shortDescription!');

export const postContentValidation = body('content').isString().trim().isLength({ min: 1, max: 1000 }).withMessage('Invalid content!');
export const postBlogIdValidation = body('blogId')
  .isString()
  .trim()
  .notEmpty()
  .custom(async value => {
    if (!ObjectId.isValid(value)) {
      throw Error('Invalid blogId!');
    }
    return await !!BlogRepository.findBlogById(value);
  })
  .withMessage('Invalid blogId!');

export const createPostValidation = () => [
  authValidation,
  postTitleValidation,
  postShortDescriptionValidation,
  postContentValidation,
  postBlogIdValidation,
  formattedErrorsValidation,
];
