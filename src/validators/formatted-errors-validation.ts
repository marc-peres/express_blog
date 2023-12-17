import { NextFunction, Request, Response } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import { HTTP_STATUSES } from '../models/common';

export const formattedErrorsValidation = (req: Request, res: Response, next: NextFunction) => {
  const formattedErrors = validationResult(req).formatWith((error: ValidationError) => {
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

    res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors);
    return;
  }
  next();
};
