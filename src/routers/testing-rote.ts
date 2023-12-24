import { Request, Response, Router } from 'express';
import { HTTP_STATUSES } from '../models/common';
import { blogsCollection, postsCollection } from '../db/db';

export const testingRoute = Router({});

testingRoute.delete('/all-data', async (req: Request, res: Response) => {
  // необходимо иметь права администратора
  // await dataBase.dropDatabase();
  await blogsCollection.deleteMany({});
  await postsCollection.deleteMany({});

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
