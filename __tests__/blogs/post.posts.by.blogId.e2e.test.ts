import request = require('supertest');
import { HTTP_STATUSES } from '../../src/common/models';
import { app } from '../../src/setting';
import { MongoClient, ObjectId } from 'mongodb';
import { headersTestConfig } from '../config';
import { PostItemOutputType } from '../../src/modules/posts';

const mongoURI = process.env.MONGO_LOCAL_URI || 'mongodb://localhost:27017';
describe('testing getting post by blogId', () => {
  const client = new MongoClient(mongoURI);
  let newBlog: PostItemOutputType;

  beforeAll(async () => {
    await client.connect();
    const response = await request(app)
      .post('/blogs')
      .set(headersTestConfig)
      .send({ name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' })
      .expect(HTTP_STATUSES.CREATED_201);
    newBlog = response.body;
  });

  afterAll(async () => {
    await request(app).delete(`/blogs/${newBlog.id}`).set(headersTestConfig).expect(HTTP_STATUSES.NO_CONTENT_204);
    await client.close();
  });

  it(`shouldn't create post with incorrect values end return 400`, async () => {
    const errorResponse = await request(app)
      .post(`/blogs/${newBlog.id}/posts`)
      .set(headersTestConfig)
      .send({ content: '', shortDescription: '', title: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(errorResponse.body).toEqual({
      errorsMessages: [
        {
          message: expect.any(String),
          field: 'title',
        },
        {
          message: expect.any(String),
          field: 'shortDescription',
        },
        {
          message: expect.any(String),
          field: 'content',
        },
      ],
    });
  });

  it(`shouldn't create post and return Unauthorized 401`, async () => {
    await request(app)
      .post(`/blogs/${newBlog.id}/posts`)
      .send({ content: '', shortDescription: '', title: '' })
      .expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  it(`shouldn't create post with no valid and return 400`, async () => {
    await request(app)
      .post(`/blogs/incorrectBlogId/posts`)
      .set(headersTestConfig)
      .send({ content: 'content', shortDescription: 'shortDescription', title: 'title' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it(`shouldn't create post with valid and return 404`, async () => {
    await request(app)
      .post(`/blogs/${new ObjectId('61d5d505025f7d83c5157c27')}/posts`)
      .set(headersTestConfig)
      .send({ content: 'content', shortDescription: 'shortDescription', title: 'title' })
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it(`should create post  and return 201`, async () => {
    await request(app)
      .post(`/blogs/${newBlog.id}/posts`)
      .set(headersTestConfig)
      .send({ content: 'content', shortDescription: 'shortDescription', title: 'title' })
      .expect(HTTP_STATUSES.CREATED_201);
  });
});
