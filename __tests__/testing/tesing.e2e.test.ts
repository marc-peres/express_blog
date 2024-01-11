import request = require('supertest');
import { HTTP_STATUSES } from '../../src/common/models';
import { app } from '../../src/setting';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { deleteAllDbTestingUtil } from './utils/e2e.testingUtils';

describe('testing api tests', () => {
  let client: MongoClient;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    client = new MongoClient(memoryUri);
    await client.connect();
  });

  afterAll(async () => {
    await client.close();
    await mongoServer.stop();
  });

  it('should delete all data', async () => {
    await deleteAllDbTestingUtil();
    const postsResponse = await request(app).get('/posts').expect(HTTP_STATUSES.OK_200);
    const blogsResponse = await request(app).get('/blogs').expect(HTTP_STATUSES.OK_200);
    const postsList = postsResponse.body.items;
    const blogsList = blogsResponse.body.items;

    expect(postsList).toBeInstanceOf(Array);
    expect(postsList).toHaveLength(0);

    expect(blogsList).toBeInstanceOf(Array);
    expect(blogsList).toHaveLength(0);
  });
});
