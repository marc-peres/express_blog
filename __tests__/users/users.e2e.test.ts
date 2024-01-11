import request = require('supertest');
import { MongoClient } from 'mongodb';
import { app } from '../../src/setting';
import { HTTP_STATUSES } from '../../src/common/models';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createUserTestingUtil, deleteAllUsersTestingUtil, getUsersTestingUtil } from './utils/e2e.userTestingUtils';

describe('testing getting post by blogId', () => {
  let client: MongoClient;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    client = new MongoClient(memoryUri);
    await client.connect();
  });

  afterAll(async () => {
    await deleteAllUsersTestingUtil();
    await client.close();
    await mongoServer.stop();
  });

  it(`should return 401 Unauthorized`, async () => {
    await request(app).get(`/users`).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  it(`shouldn't create user and return 401 Unauthorized`, async () => {
    await request(app).post(`/users`).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  it(`shouldn't create user and return 400 with error messages`, async () => {
    const response = await createUserTestingUtil(
      {
        login: '',
        password: '',
        email: '',
      },
      HTTP_STATUSES.BAD_REQUEST_400,
    );
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
    const response = await createUserTestingUtil(
      {
        login: '123',
        password: '',
        email: '',
      },
      HTTP_STATUSES.BAD_REQUEST_400,
    );
    const errorResponse = response.body;
    expect(errorResponse).toEqual({
      errorsMessages: [
        { message: 'Invalid password!', field: 'password' },
        { message: 'Invalid email!', field: 'email' },
      ],
    });
  });

  it(`shouldn't create user and return 400 with error messages`, async () => {
    const response = await createUserTestingUtil(
      {
        login: '123',
        password: '123456',
        email: '',
      },
      HTTP_STATUSES.BAD_REQUEST_400,
    );
    const errorResponse = response.body;
    expect(errorResponse).toEqual({
      errorsMessages: [{ message: 'Invalid email!', field: 'email' }],
    });
  });

  it(`should return 200 and empty user arr`, async () => {
    const response = await getUsersTestingUtil();
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
    const response = await createUserTestingUtil(
      {
        login: '123',
        password: '123456',
        email: 'test@test.test',
      },
      HTTP_STATUSES.CREATED_201,
    );
    const userResponse = response.body;
    expect(userResponse).toEqual({
      id: expect.any(String),
      login: '123',
      email: 'test@test.test',
      createdAt: expect.any(String),
    });

    const responseUserList = await getUsersTestingUtil();
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
