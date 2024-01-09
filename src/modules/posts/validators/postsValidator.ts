import { body } from 'express-validator';
import { basicAuthMiddleware } from '../../../middlewares/auth/basicAuthMiddleware';
import { ObjectId } from 'mongodb';
import { formattedErrorsValidation } from '../../../common/validators';
import { BlogQueryRepository } from '../../blogs/repositories/blogQueryRepository';

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
    const result = await BlogQueryRepository.findBlogById(value);

    if (!result) {
      throw Error('Invalid blogId!');
    }
    return true;
  })
  .withMessage('Invalid blogId!');

export const createPostValidation = () => [
  basicAuthMiddleware,
  postTitleValidation,
  postShortDescriptionValidation,
  postContentValidation,
  postBlogIdValidation,
  formattedErrorsValidation,
];
