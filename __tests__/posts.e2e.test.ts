import { app } from '../src';
import request = require('supertest');
import { HTTP_STATUSES } from '../src/models/common';
import { db } from '../src/db/db';
import { headersTestConfig } from './config';
const testingPath = '/posts';
describe('posts api tests', () => {
  // beforeAll(async () => {
  //   await request(app).delete('/blogs/all-blogs').set(headersTestConfig).expect(HTTP_STATUSES.NO_CONTENT_204);
  //   expect(db.blogs).toBeInstanceOf(Array);
  //   expect(db.blogs).toHaveLength(0);
  // });

  it('should return 200 and posts list', async () => {
    await request(app).get(testingPath).expect(HTTP_STATUSES.OK_200, db.posts);
  });

  it(`shouldn't create post end return 401 Unauthorized`, async () => {
    await request(app).post(testingPath).expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  it(`shouldn't create post with incorrect values end return 400`, async () => {
    await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ content: '', shortDescription: '', title: '', blogId: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ content: 'content', shortDescription: 'shortDescription', title: 'title', blogId: '123' })
      .expect(HTTP_STATUSES.NOT_FOUND_404);
    await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ content: 1, shortDescription: 'shortDescription', title: 'title', blogId: 'blogId' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app).post(testingPath).set(headersTestConfig).send({ content: 'content' }).expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ shortDescription: 'shortDescription' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app).post(testingPath).set(headersTestConfig).send({ title: 'title' }).expect(HTTP_STATUSES.BAD_REQUEST_400);
    await request(app).post(testingPath).set(headersTestConfig).send({ blogId: 'blogId' }).expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it(`should create post 201`, async () => {
    const blogCreateResponse = await request(app)
      .post('/blogs')
      .set(headersTestConfig)
      .send({ name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' })
      .expect(HTTP_STATUSES.CREATED_201);
    const createdBlog = blogCreateResponse.body;

    const postCreateResponse = await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ content: 'content', shortDescription: 'shortDescription', title: 'title', blogId: `${createdBlog.id}` })
      .expect(HTTP_STATUSES.CREATED_201);

    expect(postCreateResponse.body).toEqual({
      id: expect.any(String),
      content: 'content',
      shortDescription: 'shortDescription',
      title: 'title',
      blogId: createdBlog.id,
      blogName: createdBlog.name,
    });
  });

  it('should return post by id', async () => {
    const blogCreateResponse = await request(app)
      .post('/blogs')
      .set(headersTestConfig)
      .send({ name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' })
      .expect(HTTP_STATUSES.CREATED_201);
    const createdBlog = blogCreateResponse.body;

    await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ content: 'content', shortDescription: 'shortDescription', title: 'title', blogId: `wrong postId` })
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    const postCreatedResponse = await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ content: 'content', shortDescription: 'shortDescription', title: 'title', blogId: `${createdBlog.id}` })
      .expect(HTTP_STATUSES.CREATED_201);

    const newPost = postCreatedResponse.body;

    const { body } = await request(app).get(`${testingPath}/${newPost.id}`).set(headersTestConfig).expect(HTTP_STATUSES.OK_200);
    expect(body.id).toEqual(newPost.id);
  });

  it('should change blog by id', async () => {
    const blogCreateResponse = await request(app)
      .post('/blogs')
      .set(headersTestConfig)
      .send({ name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' })
      .expect(HTTP_STATUSES.CREATED_201);
    const createdBlog = blogCreateResponse.body;

    const postCreatedResponse = await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ content: 'content', shortDescription: 'shortDescription', title: 'title', blogId: `${createdBlog.id}` })
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app)
      .put(`${testingPath}/${postCreatedResponse.body.id}`)
      .set(headersTestConfig)
      .send({ content: 'new content', shortDescription: 'new shortDescription', title: 'new title', blogId: `${createdBlog.id}` })
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    const { body } = await request(app)
      .get(`${testingPath}/${postCreatedResponse.body.id}`)
      .set(headersTestConfig)
      .expect(HTTP_STATUSES.OK_200);

    expect(body).toEqual({
      id: postCreatedResponse.body.id,
      content: 'new content',
      shortDescription: 'new shortDescription',
      title: 'new title',
      blogId: createdBlog.id,
      blogName: createdBlog.name,
    });
  });

  it('should delete blog', async () => {
    const blogCreateResponse = await request(app)
      .post('/blogs')
      .set(headersTestConfig)
      .send({ name: 'new post', description: 'new post description', websiteUrl: 'https://post.test' })
      .expect(HTTP_STATUSES.CREATED_201);
    const createdBlog = blogCreateResponse.body;

    const postCreatedResponse = await request(app)
      .post(testingPath)
      .set(headersTestConfig)
      .send({ content: 'content', shortDescription: 'shortDescription', title: 'title', blogId: `${createdBlog.id}` })
      .expect(HTTP_STATUSES.CREATED_201);
    const createdPost = postCreatedResponse.body;

    await request(app).delete(`${testingPath}/${123}`).set(headersTestConfig).expect(HTTP_STATUSES.NOT_FOUND_404);
    await request(app).delete(`${testingPath}/${createdPost.id}`).set(headersTestConfig).expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app).get(`${testingPath}/${createdPost.id}`).set(headersTestConfig).expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});
