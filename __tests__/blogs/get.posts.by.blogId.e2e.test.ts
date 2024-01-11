import request = require('supertest');
import { HTTP_STATUSES } from '../../src/common/models';
import { app } from '../../src/setting';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { deleteAllDbTestingUtil } from '../testing/utils/e2e.testingUtils';
import { createNewBlogTestingUtil, getPostsByBlogIdTestingUtil } from './utils/e2e.blogsTestingUtils';
import { createNewPostTestingUtil } from '../posts/utils/e2e.postsTestingUtils';

describe('testing getting post by blogId', () => {
  let client: MongoClient;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    client = new MongoClient(memoryUri);
    await client.connect();
    await deleteAllDbTestingUtil();
  });

  afterAll(async () => {
    await client.close();
    await mongoServer.stop();
  });

  it(`shouldn't return posts`, async () => {
    await request(app).get(`/blogs/incorrectBlogId/posts`).expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it(`should create blog and post, and return post by blogId`, async () => {
    const response = await createNewBlogTestingUtil(
      { name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' },
      HTTP_STATUSES.CREATED_201,
    );
    const createdBlog = response.body;

    const postCreateResponse = await createNewPostTestingUtil(
      { content: 'content', shortDescription: 'shortDescription', title: 'title', blogId: `${createdBlog.id}` },
      HTTP_STATUSES.CREATED_201,
    );

    const postsByBlogId = await getPostsByBlogIdTestingUtil(createdBlog.id, HTTP_STATUSES.OK_200);

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
