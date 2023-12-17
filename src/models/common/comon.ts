import { Request } from 'express';

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  UNAUTHORIZED_401: 401,
  NOT_FOUND_404: 404,
};

export type PostRequestByIdType<I> = Request<I, {}, {}, {}>;
export type CreateRequestType<I> = Request<{}, {}, I, {}>;
export type PutRequestType<P, I> = Request<P, {}, I, {}>;

export type ErrorMessage = {
  message: string;
  field: string;
};
export type ErrorType = {
  errorsMessages: ErrorMessage[];
};
