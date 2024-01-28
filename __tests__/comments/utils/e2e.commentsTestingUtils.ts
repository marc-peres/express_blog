import request = require('supertest');
import { app } from '../../../src/setting';
import { PutCommentInputType } from '../../../src/modules/comments/models/input';

export const getCommentsByPostIdTestingUtil = async (postId: string, expectedStatus: number) => {
  return await request(app).get(`/posts/${postId}/comments`).expect(expectedStatus);
};

export const createCommentsByPostIdTestingUtil = async (postId: string, expectedStatus: number, token: string) => {
  return await request(app)
    .post(`/posts/${postId}/comments`)
    .set({ Authorization: `Beare ${token}` })
    .expect(expectedStatus);
};

export const getCommentsByIdTestingUtil = async (commentId: string, expectedStatus: number, token: string) => {
  return await request(app).get(`/comments/${commentId}`).expect(expectedStatus);
};

export const changeCommentsByIdTestingUtil = async (
  commentId: string,
  inputData: PutCommentInputType,
  expectedStatus: number,
  token: string,
) => {
  return await request(app)
    .put(`/comments/${commentId}`)
    .set({ Authorization: `Beare ${token}` })
    .send(inputData)
    .expect(expectedStatus);
};

export const deleteCommentsByIdTestingUtil = async (commentId: string, expectedStatus: number, token: string) => {
  return await request(app)
    .delete(`/comments/${commentId}`)
    .set({ Authorization: `Beare ${token}` })
    .expect(expectedStatus);
};
