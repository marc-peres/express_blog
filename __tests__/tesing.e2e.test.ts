import request = require('supertest');
import { HTTP_STATUSES } from '../src/common/models';
import { app } from '../src/setting';
import { MongoClient } from 'mongodb';

const testingPath = '/testing';
const mongoURI = process.env.MONGO_LOCAL_URI || 'mongodb://localhost:27017';
describe('testing api tests', () => {
  const client = new MongoClient(mongoURI);

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    await client.close();
  });

  it('should delete all data', async () => {
    await request(app).delete(`${testingPath}/all-data`).expect(HTTP_STATUSES.NO_CONTENT_204);
    const postsResponse = await request(app).get('/posts').expect(HTTP_STATUSES.OK_200);
    const blogsResponse = await request(app).get('/blogs').expect(HTTP_STATUSES.OK_200);
    const postsList = postsResponse.body;
    const blogsList = blogsResponse.body;

    expect(postsList).toBeInstanceOf(Array);
    expect(postsList).toHaveLength(0);

    expect(blogsList).toBeInstanceOf(Array);
    expect(blogsList).toHaveLength(0);
  });
});
