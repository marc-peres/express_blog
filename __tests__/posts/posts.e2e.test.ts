import request = require('supertest');
import { HTTP_STATUSES } from '../../src/common/models';
import { headersTestConfig } from '../config';
import { app } from '../../src/setting';
import { MongoClient } from 'mongodb';
import { deleteAllDbTestingUtil } from '../testing/utils/e2e.testingUtils';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  changeNewPostTestingUtil,
  createNewPostTestingUtil,
  deletePostByIdTestingUtil,
  getPostByIdTestingUtil,
} from './utils/e2e.postsTestingUtils';
import { createNewBlogTestingUtil } from '../blogs/utils/e2e.blogsTestingUtils';

describe('posts api tests', () => {
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

  it('should return 200 and posts list', async () => {
    await request(app).get('/posts').expect(HTTP_STATUSES.OK_200);
  });

  it(`shouldn't create post end return 401 Unauthorized`, async () => {
    await request(app).post('/posts').expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  it(`shouldn't create post with incorrect values end return 400`, async () => {
    await createNewPostTestingUtil({ content: 'a', shortDescription: 's', title: 'd', blogId: 'f' }, HTTP_STATUSES.BAD_REQUEST_400);
    await createNewPostTestingUtil(
      { content: 'content', shortDescription: 'shortDescription', title: 'title', blogId: '123' },
      HTTP_STATUSES.BAD_REQUEST_400,
    );
    await createNewPostTestingUtil(
      { content: '', shortDescription: 'shortDescription', title: 'title', blogId: 'blogId' },
      HTTP_STATUSES.BAD_REQUEST_400,
    );

    await createNewPostTestingUtil({ content: '', shortDescription: '', title: '', blogId: 'blogId' }, HTTP_STATUSES.BAD_REQUEST_400);
    await createNewPostTestingUtil({ content: '', shortDescription: '', title: 'title', blogId: '' }, HTTP_STATUSES.BAD_REQUEST_400);
    await createNewPostTestingUtil(
      { content: '', shortDescription: 'shortDescription', title: '', blogId: '' },
      HTTP_STATUSES.BAD_REQUEST_400,
    );
    await createNewPostTestingUtil({ content: 'content', shortDescription: '', title: '', blogId: '' }, HTTP_STATUSES.BAD_REQUEST_400);
  });

  it(`should create post 201`, async () => {
    const blogCreateResponse = await createNewBlogTestingUtil(
      { name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' },
      HTTP_STATUSES.CREATED_201,
    );
    const createdBlog = blogCreateResponse.body;

    const postCreateResponse = await createNewPostTestingUtil(
      { content: 'content', shortDescription: 'shortDescription', title: 'title', blogId: `${createdBlog.id}` },
      HTTP_STATUSES.CREATED_201,
    );

    expect(postCreateResponse.body.createdAt).toMatch(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/);
    expect(postCreateResponse.body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      content: 'content',
      shortDescription: 'shortDescription',
      title: 'title',
      blogId: createdBlog.id,
      blogName: createdBlog.name,
    });
  });

  it('should return post by id', async () => {
    const blogCreateResponse = await createNewBlogTestingUtil(
      { name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' },
      HTTP_STATUSES.CREATED_201,
    );
    const createdBlog = blogCreateResponse.body;

    await createNewPostTestingUtil(
      { content: 'content', shortDescription: 'shortDescription', title: 'title', blogId: `wrong postId` },
      HTTP_STATUSES.BAD_REQUEST_400,
    );
    const postCreatedResponse = await createNewPostTestingUtil(
      { content: 'content', shortDescription: 'shortDescription', title: 'title', blogId: `${createdBlog.id}` },
      HTTP_STATUSES.CREATED_201,
    );

    const newPost = postCreatedResponse.body;

    const { body } = await getPostByIdTestingUtil(newPost.id, HTTP_STATUSES.OK_200);
    expect(body.id).toEqual(newPost.id);
  });

  it('should change blog by id', async () => {
    const blogCreateResponse = await createNewBlogTestingUtil(
      { name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' },
      HTTP_STATUSES.CREATED_201,
    );
    const createdBlog = blogCreateResponse.body;

    const postCreatedResponse = await createNewPostTestingUtil(
      { content: 'content', shortDescription: 'shortDescription', title: 'title', blogId: `${createdBlog.id}` },
      HTTP_STATUSES.CREATED_201,
    );
    await changeNewPostTestingUtil(
      postCreatedResponse.body.id,
      {
        content: 'valid',
        shortDescription: 'length_101-DnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx',
        title: 'valid',
        blogId: `63189b06003380064c4193be`,
      },
      HTTP_STATUSES.BAD_REQUEST_400,
    );

    await changeNewPostTestingUtil(
      postCreatedResponse.body.id,
      { content: 'new content', shortDescription: 'new shortDescription', title: 'new title', blogId: `${createdBlog.id}` },
      HTTP_STATUSES.NO_CONTENT_204,
    );

    const { body } = await request(app).get(`/posts/${postCreatedResponse.body.id}`).set(headersTestConfig).expect(HTTP_STATUSES.OK_200);
    expect(body.createdAt).toMatch(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/);
    expect(body).toEqual({
      id: postCreatedResponse.body.id,
      createdAt: expect.any(String),
      content: 'new content',
      shortDescription: 'new shortDescription',
      title: 'new title',
      blogId: createdBlog.id,
      blogName: createdBlog.name,
    });
  });

  it('should delete blog', async () => {
    const blogCreateResponse = await createNewBlogTestingUtil(
      { name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' },
      HTTP_STATUSES.CREATED_201,
    );
    const createdBlog = blogCreateResponse.body;

    const postCreatedResponse = await createNewPostTestingUtil(
      { content: 'content', shortDescription: 'shortDescription', title: 'title', blogId: `${createdBlog.id}` },
      HTTP_STATUSES.CREATED_201,
    );
    const createdPost = postCreatedResponse.body;

    await deletePostByIdTestingUtil('123', HTTP_STATUSES.BAD_REQUEST_400);
    await deletePostByIdTestingUtil(createdPost.id, HTTP_STATUSES.NO_CONTENT_204);

    await getPostByIdTestingUtil(createdPost.id, HTTP_STATUSES.NOT_FOUND_404);
  });
});
