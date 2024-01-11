import request = require('supertest');
import { HTTP_STATUSES } from '../../src/common/models';
import { app } from '../../src/setting';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { deleteAllDbTestingUtil } from '../testing/utils/e2e.testingUtils';
import {
  changeBlogTestingUtil,
  createNewBlogTestingUtil,
  deleteBlogByIdTestingUtil,
  getBlogByIdTestingUtil,
} from './utils/e2e.blogsTestingUtils';

describe('blogs api tests', () => {
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

  it('should return 200 and blogs list', async () => {
    await request(app).get('/blogs').expect(HTTP_STATUSES.OK_200);
  });

  it(`shouldn't create blog end return 401 Unauthorized`, async () => {
    await request(app).post('/blogs').expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  it(`shouldn't create blog with incorrect values end return 400`, async () => {
    await createNewBlogTestingUtil(
      {
        name: 'somename',
        websiteUrl: 'https://length_101-DnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx.com',
        description: 'description',
      },
      HTTP_STATUSES.BAD_REQUEST_400,
    );
    await createNewBlogTestingUtil({ name: '', description: '', websiteUrl: '' }, HTTP_STATUSES.BAD_REQUEST_400);
    await createNewBlogTestingUtil({ name: '12345678901234567890', description: '', websiteUrl: '' }, HTTP_STATUSES.BAD_REQUEST_400);
    await createNewBlogTestingUtil({ name: '1234567890', description: '', websiteUrl: '' }, HTTP_STATUSES.BAD_REQUEST_400);
    await createNewBlogTestingUtil({ name: 'name', description: 'description', websiteUrl: '' }, HTTP_STATUSES.BAD_REQUEST_400);
    await createNewBlogTestingUtil({ name: 'name', description: 'description', websiteUrl: 'websiteUrl' }, HTTP_STATUSES.BAD_REQUEST_400);
  });

  it(`should create blog 201`, async () => {
    const response = await createNewBlogTestingUtil(
      { name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' },
      HTTP_STATUSES.CREATED_201,
    );

    const createdBlog = response.body;
    expect(createdBlog).toEqual({
      id: expect.any(String),
      name: 'new post',
      description: 'new post description',
      websiteUrl: 'https://post.test',
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it('should return blog by id', async () => {
    const response = await createNewBlogTestingUtil(
      { name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' },
      HTTP_STATUSES.CREATED_201,
    );

    const createdBlog = response.body;
    const { body } = await getBlogByIdTestingUtil(createdBlog.id, HTTP_STATUSES.OK_200);
    expect(body.id).toEqual(createdBlog.id);
    expect(body).toEqual({
      id: createdBlog.id,
      name: 'new post',
      description: 'new post description',
      websiteUrl: 'https://post.test',
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it('should change blog by id', async () => {
    const response = await createNewBlogTestingUtil(
      { name: 'post', description: 'post description', websiteUrl: 'https://post.test' },
      HTTP_STATUSES.CREATED_201,
    );
    const createdBlog = response.body;

    await changeBlogTestingUtil(
      createdBlog.id,
      { name: 'new post', description: 'new post description', websiteUrl: 'https://newpost.test' },
      HTTP_STATUSES.NO_CONTENT_204,
    );

    const res = await getBlogByIdTestingUtil(createdBlog.id, HTTP_STATUSES.OK_200);
    const changedBlog = res.body;
    expect(changedBlog.id).toEqual(createdBlog.id);

    expect(changedBlog).toEqual({
      id: expect.any(String),
      name: 'new post',
      description: 'new post description',
      websiteUrl: 'https://newpost.test',
      createdAt: expect.any(String),
      isMembership: false,
    });
  });

  it('should delete blog', async () => {
    const response = await createNewBlogTestingUtil(
      { name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' },
      HTTP_STATUSES.CREATED_201,
    );
    const createdBlog = response.body;
    await deleteBlogByIdTestingUtil('123', HTTP_STATUSES.BAD_REQUEST_400);
    await deleteBlogByIdTestingUtil(createdBlog.id, HTTP_STATUSES.NO_CONTENT_204);
    await getBlogByIdTestingUtil(createdBlog.id, HTTP_STATUSES.NOT_FOUND_404);
  });
});
