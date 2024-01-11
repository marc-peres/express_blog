import request = require('supertest');
import { HTTP_STATUSES } from '../../src/common/models';
import { app } from '../../src/setting';
import { MongoClient, ObjectId } from 'mongodb';
import { PostItemOutputType } from '../../src/modules/posts';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { deleteAllDbTestingUtil } from '../testing/utils/e2e.testingUtils';
import { createNewBlogTestingUtil, createPostByBlogIdTestingUtil } from './utils/e2e.blogsTestingUtils';

describe('testing getting post by blogId', () => {
  let newBlog: PostItemOutputType;

  let client: MongoClient;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    client = new MongoClient(memoryUri);
    await client.connect();
    await deleteAllDbTestingUtil();
    const response = await createNewBlogTestingUtil(
      { name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' },
      HTTP_STATUSES.CREATED_201,
    );
    newBlog = response.body;
  });

  afterAll(async () => {
    await client.close();
    await mongoServer.stop();
  });

  it(`shouldn't create post with incorrect values end return 400`, async () => {
    const errorResponse = await createPostByBlogIdTestingUtil(
      newBlog.id,
      { content: '', shortDescription: '', title: '' },
      HTTP_STATUSES.BAD_REQUEST_400,
    );

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
    await createPostByBlogIdTestingUtil('incorrectBlogId', { content: '', shortDescription: '', title: '' }, HTTP_STATUSES.BAD_REQUEST_400);
  });

  it(`shouldn't create post with valid and return 404`, async () => {
    await createPostByBlogIdTestingUtil(
      new ObjectId('61d5d505025f7d83c5157c27'),
      { content: 'content', shortDescription: 'shortDescription', title: 'title' },
      HTTP_STATUSES.NOT_FOUND_404,
    );
  });

  it(`should create post  and return 201`, async () => {
    await createPostByBlogIdTestingUtil(
      newBlog.id,
      { content: 'content', shortDescription: 'shortDescription', title: 'title' },
      HTTP_STATUSES.CREATED_201,
    );
  });
});
