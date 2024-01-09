import request = require('supertest');
import { MongoClient } from 'mongodb';
import { app } from '../../src/setting';
import { HTTP_STATUSES } from '../../src/common/models';
import { headersTestConfig } from '../config';
import { envVariables } from '../../src/common/env';

const mongoURI = envVariables.mongoLocalDbUri;
describe('testing getting post by blogId', () => {
  const client = new MongoClient(mongoURI);

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    await request(app).delete(`/users/all-users`).set(headersTestConfig).expect(HTTP_STATUSES.NO_CONTENT_204);
    await client.close();
  });

  it(`should return 401 Unauthorized`, async () => {
    await request(app).get(`/users`).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  it(`shouldn't create user and return 401 Unauthorized`, async () => {
    await request(app).post(`/users`).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  it(`shouldn't create user and return 400 with error messages`, async () => {
    const response = await request(app)
      .post(`/users`)
      .send({
        login: '',
        password: '',
        email: '',
      })
      .set(headersTestConfig)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    const errorResponse = response.body;
    expect(errorResponse).toEqual({
      errorsMessages: [
        { message: 'Invalid value', field: 'login' },
        { message: 'Invalid password!', field: 'password' },
        { message: 'Invalid email!', field: 'email' },
      ],
    });
  });

  it(`shouldn't create user and return 400 with error messages`, async () => {
    const response = await request(app)
      .post(`/users`)
      .send({
        login: '123',
        password: '',
        email: '',
      })
      .set(headersTestConfig)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    const errorResponse = response.body;
    expect(errorResponse).toEqual({
      errorsMessages: [
        { message: 'Invalid password!', field: 'password' },
        { message: 'Invalid email!', field: 'email' },
      ],
    });
  });

  it(`shouldn't create user and return 400 with error messages`, async () => {
    const response = await request(app)
      .post(`/users`)
      .send({
        login: '123',
        password: '123456',
        email: '',
      })
      .set(headersTestConfig)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    const errorResponse = response.body;
    expect(errorResponse).toEqual({
      errorsMessages: [{ message: 'Invalid email!', field: 'email' }],
    });
  });

  it(`should return 200 and empty user arr`, async () => {
    const response = await request(app).get(`/users`).set(headersTestConfig).expect(HTTP_STATUSES.OK_200);
    const userResponse = response.body;
    expect(userResponse).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it(`should create and return user with 201, should return user list`, async () => {
    const response = await request(app)
      .post(`/users`)
      .send({
        login: '123',
        password: '123456',
        email: 'test@test.test',
      })
      .set(headersTestConfig)
      .expect(HTTP_STATUSES.CREATED_201);
    const userResponse = response.body;
    expect(userResponse).toEqual({
      id: expect.any(String),
      login: '123',
      email: 'test@test.test',
      createdAt: expect.any(String),
    });

    const responseUserList = await request(app).get(`/users`).set(headersTestConfig).expect(HTTP_STATUSES.OK_200);
    const users = responseUserList.body;
    expect(users).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        {
          id: expect.any(String),
          login: '123',
          email: 'test@test.test',
          createdAt: expect.any(String),
        },
      ],
    });
  });
});
