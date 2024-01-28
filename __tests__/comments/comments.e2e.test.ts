import request = require('supertest');
import { HTTP_STATUSES } from '../../src/common/models';
import { app } from '../../src/setting';
import { MongoClient } from 'mongodb';
import { deleteAllDbTestingUtil } from '../testing/utils/e2e.testingUtils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createUserTestingUtil } from '../users/utils/e2e.userTestingUtils';
import { authLoginTestingUtil } from '../auth/utils/e2e.authTestingUtils';

describe('posts api tests', () => {
  const crestedUserData = { password: 'testPassword', login: 'testLogin', email: 'test@email.com' };
  let userJwtToken = '';
  let client: MongoClient;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    client = new MongoClient(memoryUri);
    await client.connect();
    await createUserTestingUtil(crestedUserData, HTTP_STATUSES.CREATED_201);
    const { body } = await authLoginTestingUtil(
      { loginOrEmail: crestedUserData.login, password: crestedUserData.password },
      HTTP_STATUSES.OK_200,
    );
    userJwtToken = body.accessToken || '';
  });

  afterAll(async () => {
    await deleteAllDbTestingUtil();
    await client.close();
    await mongoServer.stop();
  });

  it('should return 200 and posts list', async () => {
    console.log('userJwtToken', userJwtToken);
    // await request(app).get('/posts').expect(HTTP_STATUSES.OK_200);
  });
});
