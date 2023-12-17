import { Request, Response, Router } from 'express';
import { authValidation } from '../middlewares/auth/auth-validation';
import { HTTP_STATUSES } from '../models/common';
import { TestingRepository } from '../repositories/testing-repository';

export const testingRoute = Router({});

testingRoute.delete('/all-data', authValidation, (req: Request, res: Response) => {
  const result = TestingRepository.deleteAllVideos();
  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
});
