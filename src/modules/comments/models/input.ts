import { SortDirection } from 'mongodb';

export type InputCreateCommentType = {
  content: string;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
};

export type InputCommentsWithQueryType = {
  postId: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
};

export type PutCommentInputType = { content: string };
export type CommentIdParamType = { id: string };
