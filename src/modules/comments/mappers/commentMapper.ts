import { WithId } from 'mongodb';
import { CommentsDbType } from '../../../db/models/db';
import { CommentItemOutputType } from '../models/output';

export const commentMapper = (post: WithId<CommentsDbType>): CommentItemOutputType => {
  return {
    id: post._id.toString(),
    content: post.content,
    commentatorInfo: {
      userId: post.commentatorInfo.userId,
      userLogin: post.commentatorInfo.userLogin,
    },
    createdAt: post.createdAt,
  };
};
