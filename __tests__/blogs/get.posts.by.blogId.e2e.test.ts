import request = require('supertest');
import { HTTP_STATUSES } from '../../src/common/models';
import { app } from '../../src/setting';
import { MongoClient } from 'mongodb';
import { headersTestConfig } from '../config';

const mongoURI = process.env.MONGO_LOCAL_URI || 'mongodb://localhost:27017';
describe('testing getting post by blogId', () => {
  const client = new MongoClient(mongoURI);

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    await client.close();
  });

  it(`shouldn't return posts`, async () => {
    await request(app).get(`/blogs/incorrectBlogId/posts`).expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it(`should create blog and post, and return post by blogId`, async () => {
    const response = await request(app)
      .post('/blogs')
      .set(headersTestConfig)
      .send({ name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' })
      .expect(HTTP_STATUSES.CREATED_201);
    const createdBlog = response.body;

    const postCreateResponse = await request(app)
      .post('/posts')
      .set(headersTestConfig)
      .send({ content: 'content', shortDescription: 'shortDescription', title: 'title', blogId: `${createdBlog.id}` })
      .expect(HTTP_STATUSES.CREATED_201);

    const postsByBlogId = await request(app).get(`/blogs/${createdBlog.id}/posts`).query({}).expect(HTTP_STATUSES.OK_200);
    expect(postsByBlogId.body).toEqual({
      pagesCount: expect.any(Number),
      page: 1,
      pageSize: 10,
      totalCount: expect.any(Number),
      items: [
        {
          blogId: postCreateResponse.body.blogId,
          content: postCreateResponse.body.content,
          shortDescription: postCreateResponse.body.shortDescription,
          title: postCreateResponse.body.title,
          blogName: postCreateResponse.body.blogName,
          createdAt: postCreateResponse.body.createdAt,
          id: postCreateResponse.body.id,
        },
      ],
    });
  });
});
