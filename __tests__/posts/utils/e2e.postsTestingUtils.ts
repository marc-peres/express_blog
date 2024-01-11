import request = require('supertest');
import { app } from '../../../src/setting';
import { InputCreatePostType } from '../../../src/modules/posts';
import { headersTestConfig } from '../../config';

export const createNewPostTestingUtil = async (inputData: InputCreatePostType, expectedStatus: number) => {
  return request(app).post('/posts').set(headersTestConfig).send(inputData).expect(expectedStatus);
};

export const changeNewPostTestingUtil = async (postId: string, inputData: InputCreatePostType, expectedStatus: number) => {
  return request(app).put(`/posts/${postId}`).set(headersTestConfig).send(inputData).expect(expectedStatus);
};

export const getPostByIdTestingUtil = async (postId: string, expectedStatus: number) => {
  return await request(app).get(`/posts/${postId}`).set(headersTestConfig).expect(expectedStatus);
};

export const deletePostByIdTestingUtil = async (postId: string, expectedStatus: number) => {
  return await request(app).delete(`/posts/${postId}`).set(headersTestConfig).expect(expectedStatus);
};
