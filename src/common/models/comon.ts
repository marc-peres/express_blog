import { Request } from 'express';

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  UNAUTHORIZED_401: 401,
  NOT_FOUND_404: 404,
};

export type RequestWithParamsType<P> = Request<P, {}, {}, {}>;
export type RequestWithBodyType<B> = Request<{}, {}, B, {}>;
export type RequestWithQueryType<Q> = Request<{}, {}, {}, Q>;
export type RequestWithParamsAndQueryType<P, Q> = Request<P, {}, {}, Q>;
export type RequestWithParamsAndBodyType<P, B> = Request<P, {}, B, {}>;

export type ErrorMessage = {
  message: string;
  field: string;
};
export type ErrorType = {
  errorsMessages: ErrorMessage[];
};
