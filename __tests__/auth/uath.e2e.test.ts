import { MongoClient } from 'mongodb';
import { HTTP_STATUSES } from '../../src/common/models';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { authLoginTestingUtil } from './utils/e2e.authTestingUtils';
import { createUserTestingUtil, deleteAllUsersTestingUtil } from '../users/utils/e2e.userTestingUtils';

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

  it(`shouldn't authorized and return errors`, async () => {
    const response = await authLoginTestingUtil({ loginOrEmail: '', password: '' }, HTTP_STATUSES.BAD_REQUEST_400);
    const errorResponse = response.body;
    expect(errorResponse).toEqual({
      errorsMessages: [
        { message: 'Invalid loginOrEmail!', field: 'loginOrEmail' },
        { message: 'Invalid password!', field: 'password' },
      ],
    });
  });

  it(`shouldn't authorized and return 401`, async () => {
    await authLoginTestingUtil({ loginOrEmail: 'loginOrEmail', password: 'password' }, HTTP_STATUSES.UNAUTHORIZED_401);
  });

  it(`shouldn't authorized and return errors`, async () => {
    await createUserTestingUtil(
      {
        login: '123',
        password: '123456',
        email: 'test@test.test',
      },
      HTTP_STATUSES.CREATED_201,
    );
    await authLoginTestingUtil({ loginOrEmail: '123', password: 'wrong' }, HTTP_STATUSES.UNAUTHORIZED_401);
    await authLoginTestingUtil({ loginOrEmail: 'test@test.test', password: 'wrong' }, HTTP_STATUSES.UNAUTHORIZED_401);
    await authLoginTestingUtil({ loginOrEmail: '123', password: '123456' }, HTTP_STATUSES.OK_200);
    await authLoginTestingUtil({ loginOrEmail: 'test@test.test', password: '123456' }, HTTP_STATUSES.OK_200);
  });
});
