import request = require('supertest');
import { app } from '../../../src/setting';
import { headersTestConfig } from '../../config';
import { InputBlogWithQueryType, InputCreateBlogType } from '../../../src/modules/blogs';
import { InputCreatePostByBlogIdType } from '../../../src/modules/blogs/models/input';
import { ObjectId } from 'mongodb';

export const createNewBlogTestingUtil = async (inputData: InputCreateBlogType, expectedStatus: number) => {
  return await request(app).post('/blogs').set(headersTestConfig).send(inputData).expect(expectedStatus);
};

export const createPostByBlogIdTestingUtil = async (blogId: string | ObjectId, inputData: InputCreatePostByBlogIdType, dStatus: number) => {
  return await request(app).post(`/blogs/${blogId}/posts`).set(headersTestConfig).send(inputData).expect(dStatus);
};

export const getBlogByIdTestingUtil = async (blogId: string, expectedStatus: number) => {
  return await request(app).get(`/blogs/${blogId}`).expect(expectedStatus);
};

export const getPostsByBlogIdTestingUtil = async (blogId: string, expectedStatus: number, queryData: InputBlogWithQueryType = {}) => {
  return await request(app).get(`/blogs/${blogId}/posts`).query(queryData).expect(expectedStatus);
};

export const changeBlogTestingUtil = async (blogId: string, inputData: InputCreateBlogType, expectedStatus: number) => {
  return await request(app).put(`/blogs/${blogId}`).set(headersTestConfig).send(inputData).expect(expectedStatus);
};

export const deleteBlogByIdTestingUtil = async (blogId: string, expectedStatus: number) => {
  return await request(app).delete(`/blogs/${blogId}`).set(headersTestConfig).expect(expectedStatus);
};
