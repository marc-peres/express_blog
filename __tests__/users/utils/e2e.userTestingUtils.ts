import request = require('supertest');
import { app } from '../../../src/setting';
import { headersTestConfig } from '../../config';
import { InputPostUsersType, InputUsersWithQueryType } from '../../../src/modules/users/models/input';
import { HTTP_STATUSES } from '../../../src/common/models';

export const deleteAllUsersTestingUtil = async () => {
  return await request(app).delete(`/users/all-users`).set(headersTestConfig).expect(HTTP_STATUSES.NO_CONTENT_204);
};

export const createUserTestingUtil = async (inputData: InputPostUsersType, expectedStatus: number) => {
  return await request(app).post(`/users`).send(inputData).set(headersTestConfig).expect(expectedStatus);
};

export const getUsersTestingUtil = async (query: InputUsersWithQueryType = {}) => {
  let queryStr = query ? '?' : '';
  const queryLength = Object.keys(query).length;
  if (queryLength) {
    Object.entries(query).forEach((queryItem, index) => {
      queryStr += `${queryItem[0]}=${queryItem[1]}${index === queryLength - 1 ? '' : '&'}`;
    });
  }
  return await request(app)
    .get(`/users${queryStr.length ? queryStr : ''}`)
    .set(headersTestConfig)
    .expect(HTTP_STATUSES.OK_200);
};
