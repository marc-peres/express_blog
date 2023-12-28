import { WithId } from 'mongodb';
import { PostBdType } from '../../../db/models/db';
import { PostItemType } from '../models/output';

export const postMapper = (post: WithId<PostBdType>): PostItemType => {
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
