import request = require('supertest');
import { HTTP_STATUSES } from '../src/models/common';
import { headersTestConfig } from './config';
import { app } from '../src/setting';
import { MongoClient } from 'mongodb';

const testingPath = '/blogs';
const mongoURI = process.env.MONGO_LOCAL_URI || 'mongodb://localhost:27017';
describe('blogs api tests', () => {
  const client = new MongoClient(mongoURI);

  beforeAll(async () => {
    await client.connect();
    await request(app).delete('/blogs/all-blogs').expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  afterAll(async () => {
    await client.close();
  });

  it('should return 200 and blogs list', async () => {
    await request(app).get(testingPath).expect(HTTP_STATUSES.OK_200);
  });

  it(`shouldn't create blog end return 401 Unauthorized`, async () => {
    await request(app).post(testingPath).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  it(`shouldn't create blog with incorrect values end return 400`, async () => {
    await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({
        id: '2023-12-17T12:00:24.261Z',
        name: 'somename',
        websiteUrl: 'https://length_101-DnZlTI1khUHpqOqCzftIYiSHCV8fKjYFQOoCIwmUczzW9V5K8cqY3aPKo3XKwbfrmeWOJyQgGnlX5sP3aW3RlaRSQx.com',
        description: 'description',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ name: '', description: '', websiteUrl: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ name: '', description: '', websiteUrl: null })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ name: '', description: undefined, websiteUrl: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ name: 1, description: '', websiteUrl: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ name: '12345678901234567890', description: '', websiteUrl: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ name: '1234567890', description: '', websiteUrl: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ name: 'name', description: 'description', websiteUrl: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ name: 'name', description: 'description', websiteUrl: 'websiteUrl' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it(`should create blog 201`, async () => {
    const response = await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' })
      .expect(HTTP_STATUSES.CREATED_201);
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
    const response = await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' })
      .expect(HTTP_STATUSES.CREATED_201);
    const createdBlog = response.body;
    const { body } = await request(app).get(`${testingPath}/${createdBlog.id}`).expect(HTTP_STATUSES.OK_200);
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
    const response = await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ name: 'post', description: 'post description', websiteUrl: 'https://post.test' })
      .expect(HTTP_STATUSES.CREATED_201);
    const createdBlog = response.body;

    await request(app)
      .put(`${testingPath}/${createdBlog.id}`)
      .set(headersTestConfig)
      .send({ name: 'new post', description: 'new post description', websiteUrl: 'https://newpost.test' })
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    const res = await request(app).get(`${testingPath}/${createdBlog.id}`).set(headersTestConfig).expect(HTTP_STATUSES.OK_200);
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
    const response = await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' })
      .expect(HTTP_STATUSES.CREATED_201);
    const createdBlog = response.body;

    await request(app).delete(`${testingPath}/${123}`).set(headersTestConfig).expect(HTTP_STATUSES.NOT_FOUND_404);
    await request(app).delete(`${testingPath}/${createdBlog.id}`).set(headersTestConfig).expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app).get(`${testingPath}/${createdBlog.id}`).set(headersTestConfig).expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});
