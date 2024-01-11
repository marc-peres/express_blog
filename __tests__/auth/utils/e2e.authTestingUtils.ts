import request = require('supertest');
import { app } from '../../../src/setting';
import { InputLoginAuthType } from '../../../src/modules/auth/models/input';

export const authLoginTestingUtil = async (inputData: InputLoginAuthType, expectedStatus: number) => {
  return await request(app).post(`/auth/login`).send(inputData).expect(expectedStatus);
};
