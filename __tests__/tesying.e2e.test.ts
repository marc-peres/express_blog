import request = require('supertest');
import { HTTP_STATUSES } from '../src/models/common';
import { headersTestConfig } from './config';
import { app } from '../src/setting';
import { db } from '../src/db/db';

const testingPath = '/testing';
describe('testing api tests', () => {
  beforeAll(async () => {
    await request(app).delete('/blogs/all-blogs').set(headersTestConfig).expect(HTTP_STATUSES.NO_CONTENT_204);
    expect(db.blogs).toBeInstanceOf(Array);
    expect(db.blogs).toHaveLength(0);
  });

  it('should delete all data', async () => {
    await request(app).delete(`${testingPath}/all-data`).set(headersTestConfig).expect(HTTP_STATUSES.NO_CONTENT_204);
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
