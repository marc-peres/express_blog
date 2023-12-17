import { body } from 'express-validator';
import { formattedErrorsValidation } from './formatted-errors-validation';
import { AvailableResolutionsType } from '../models/videos';
import { authValidation } from '../middlewares/auth/auth-validation';
import { isISOString } from '../utils';

export const videoTitleValidation = body('title').isString().trim().isLength({ min: 1, max: 40 }).withMessage('Invalid title');
export const videoAuthorValidation = body('author').isString().trim().isLength({ min: 1, max: 20 }).withMessage('Invalid author');
export const availableResolutionsAuthorValidation = body('availableResolutions')
  .if((value, { req }) => req.body.availableResolutions)
  .isArray({ min: 1, max: Object.values(AvailableResolutionsType).length })
  .withMessage('Mast have minimum one value')
  .custom(availableResolutions => {
    let result = true;
    if (availableResolutions === undefined) {
      return result;
    }
    for (let i = 0; i < availableResolutions.length; i++) {
      if (!Object.keys(AvailableResolutionsType).includes(availableResolutions[i] as AvailableResolutionsType)) {
        result = false;
        break;
      }
    }
    return result;
  })
  .withMessage('Invalid availableResolutions');

export const videoCanBeDownloadedValidation = body('canBeDownloaded')
  .if((value, { req }) => req.body.availableResolutions)
  .isInt({ min: 1, max: 18 })
  .withMessage('Invalid canBeDownloaded');

export const videoMinAgeRestrictionValidation = body('minAgeRestriction')
  .if((value, { req }) => req.body.minAgeRestriction)
  .isBoolean()
  .withMessage('Invalid minAgeRestriction');

export const videoPublicationDateValidation = body('publicationDate')
  .if((value, { req }) => req.body.publicationDate)
  .isString()
  .trim()
  .notEmpty()
  .custom(publicationDate => isISOString(publicationDate))
  .withMessage('Invalid publicationDate');

export const videoPostValidation = () => [
  authValidation,
  videoTitleValidation,
  videoAuthorValidation,
  availableResolutionsAuthorValidation,
  formattedErrorsValidation,
];

export const videoPutValidation = () => [
  authValidation,
  videoTitleValidation,
  videoAuthorValidation,
  availableResolutionsAuthorValidation,
  videoCanBeDownloadedValidation,
  videoMinAgeRestrictionValidation,
  videoPublicationDateValidation,
  formattedErrorsValidation,
];
