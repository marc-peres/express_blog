import request = require('supertest');
import { MongoClient } from 'mongodb';
import { app } from '../../src/setting';
import { headersTestConfig } from '../config';
import { HTTP_STATUSES } from '../../src/common/models';

const mongoURI = process.env.MONGO_LOCAL_URI || 'mongodb://localhost:27017';
describe('testing getting post by blogId', () => {
  const client = new MongoClient(mongoURI);

  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    await request(app).delete(`/users/all-users`).set(headersTestConfig).expect(HTTP_STATUSES.NO_CONTENT_204);
    await client.close();
  });

  it(`shouldn't authorized and return errors`, async () => {
    const response = await request(app).post(`/auth/login`).send({ loginOrEmail: '', password: '' }).expect(HTTP_STATUSES.BAD_REQUEST_400);
    const errorResponse = response.body;
    expect(errorResponse).toEqual({
      errorsMessages: [
        { message: 'Invalid loginOrEmail!', field: 'loginOrEmail' },
        { message: 'Invalid password!', field: 'password' },
      ],
    });
  });

  it(`shouldn't authorized and return 401`, async () => {
    await request(app)
      .post(`/auth/login`)
      .send({ loginOrEmail: 'loginOrEmail', password: 'password' })
      .expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  it(`shouldn't authorized and return errors`, async () => {
    await request(app)
      .post(`/users`)
      .send({
        login: '123',
        password: '123456',
        email: 'test@test.test',
      })
      .set(headersTestConfig)
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app).post(`/auth/login`).send({ loginOrEmail: '123', password: 'wrong' }).expect(HTTP_STATUSES.UNAUTHORIZED_401);
    await request(app)
      .post(`/auth/login`)
      .send({ loginOrEmail: 'test@test.test', password: 'wrong' })
      .expect(HTTP_STATUSES.UNAUTHORIZED_401);
    await request(app).post(`/auth/login`).send({ loginOrEmail: '123', password: '123456' }).expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app)
      .post(`/auth/login`)
      .send({ loginOrEmail: 'test@test.test', password: '123456' })
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });
});
