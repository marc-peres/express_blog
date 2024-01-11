import request = require('supertest');
import { app } from '../../../src/setting';
import { HTTP_STATUSES } from '../../../src/common/models';

export const deleteAllDbTestingUtil = async () => {
  return await request(app).delete(`/testing/all-data`).expect(HTTP_STATUSES.NO_CONTENT_204);
};
