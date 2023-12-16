"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoPutValidation = exports.videoPostValidation = exports.videoPublicationDateValidation = exports.videoMinAgeRestrictionValidation = exports.videoCanBeDownloadedValidation = exports.availableResolutionsAuthorValidation = exports.videoAuthorValidation = exports.videoTitleValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_1 = require("../middlewares/input-model-validation/input-validation");
const videos_1 = require("../models/videos");
const auth_validation_1 = require("../middlewares/auth/auth-validation");
const utils_1 = require("../utils");
exports.videoTitleValidation = (0, express_validator_1.body)('title').isString().trim().isLength({ min: 1, max: 40 }).withMessage('Invalid title');
exports.videoAuthorValidation = (0, express_validator_1.body)('author').isString().trim().isLength({ min: 1, max: 20 }).withMessage('Invalid author');
exports.availableResolutionsAuthorValidation = (0, express_validator_1.body)('availableResolutions')
    .if((value, { req }) => req.body.availableResolutions)
    .isArray({ min: 1, max: Object.values(videos_1.AvailableResolutionsType).length })
    .withMessage('Mast have minimum one value')
    .custom(availableResolutions => {
    let result = true;
    if (availableResolutions === undefined) {
        return result;
    }
    for (let i = 0; i < availableResolutions.length; i++) {
        if (!Object.keys(videos_1.AvailableResolutionsType).includes(availableResolutions[i])) {
            result = false;
            break;
        }
    }
    return result;
})
    .withMessage('Invalid availableResolutions');
exports.videoCanBeDownloadedValidation = (0, express_validator_1.body)('canBeDownloaded')
    .if((value, { req }) => req.body.availableResolutions)
    .isInt({ min: 1, max: 18 })
    .withMessage('Invalid canBeDownloaded');
exports.videoMinAgeRestrictionValidation = (0, express_validator_1.body)('minAgeRestriction')
    .if((value, { req }) => req.body.minAgeRestriction)
    .isBoolean()
    .withMessage('Invalid minAgeRestriction');
exports.videoPublicationDateValidation = (0, express_validator_1.body)('publicationDate')
    .if((value, { req }) => req.body.publicationDate)
    .isString()
    .trim()
    .notEmpty()
    .custom(publicationDate => (0, utils_1.isISOString)(publicationDate))
    .withMessage('Invalid publicationDate');
const videoPostValidation = () => [
    auth_validation_1.authValidation,
    exports.videoTitleValidation,
    exports.videoAuthorValidation,
    exports.availableResolutionsAuthorValidation,
    input_validation_1.inputValidation,
];
exports.videoPostValidation = videoPostValidation;
const videoPutValidation = () => [
    auth_validation_1.authValidation,
    exports.videoTitleValidation,
    exports.videoAuthorValidation,
    exports.availableResolutionsAuthorValidation,
    exports.videoCanBeDownloadedValidation,
    exports.videoMinAgeRestrictionValidation,
    exports.videoPublicationDateValidation,
    input_validation_1.inputValidation,
];
exports.videoPutValidation = videoPutValidation;
