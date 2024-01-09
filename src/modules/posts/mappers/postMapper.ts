import { WithId } from 'mongodb';
import { PostDbType } from '../../../db/models/db';
import { PostItemOutputType } from '../models/output';

export const postMapper = (post: WithId<PostDbType>): PostItemOutputType => {
  return {
    id: post._id.toString(),
    title: post.title,
    blogName: post.blogName,
    blogId: post.blogId,
    content: post.content,
    shortDescription: post.shortDescription,
    createdAt: post.createdAt,
  };
};
