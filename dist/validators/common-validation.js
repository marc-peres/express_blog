"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idValid = exports.idValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_1 = require("../middlewares/input-model-validation/input-validation");
exports.idValidation = (0, express_validator_1.param)('id')
    .isString()
    .trim()
    .custom(id => !isNaN(id))
    .withMessage('Invalid id');
const idValid = () => [exports.idValidation, input_validation_1.inputValidation];
exports.idValid = idValid;
