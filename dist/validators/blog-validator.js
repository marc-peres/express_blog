"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogPostValidation = exports.websiteUrlValidation = exports.descriptionValidation = exports.nameValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_1 = require("../middlewares/input-model-validation/input-validation");
const auth_validation_1 = require("../middlewares/auth/auth-validation");
exports.nameValidation = (0, express_validator_1.body)('name').isString().trim().isLength({ min: 1, max: 15 }).withMessage('Invalid name!');
exports.descriptionValidation = (0, express_validator_1.body)('description')
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Invalid description!');
exports.websiteUrlValidation = (0, express_validator_1.body)('websiteUrl')
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage('Invalid websiteUrl!');
const blogPostValidation = () => [auth_validation_1.authValidation, exports.nameValidation, exports.descriptionValidation, exports.websiteUrlValidation, input_validation_1.inputValidation];
exports.blogPostValidation = blogPostValidation;
