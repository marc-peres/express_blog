"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidation = void 0;
const express_validator_1 = require("express-validator");
const common_1 = require("../../models/common");
const inputValidation = (req, res, next) => {
    const formattedErrors = (0, express_validator_1.validationResult)(req).formatWith((error) => {
        switch (error.type) {
            case 'field':
                return {
                    message: error.msg,
                    field: error.path,
                };
            default:
                return {
                    message: error.msg,
                    field: 'Unknown',
                };
        }
    });
    if (!formattedErrors.isEmpty()) {
        const errorsMessages = formattedErrors.array({ onlyFirstError: true });
        const errors = {
            errorsMessages,
        };
        res.status(common_1.HTTP_STATUSES.BAD_REQUEST_400).send(errors);
    }
    next();
};
exports.inputValidation = inputValidation;
