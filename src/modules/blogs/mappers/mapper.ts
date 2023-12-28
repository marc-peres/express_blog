import { WithId } from 'mongodb';
import { BlogBdType } from '../../../db/models/db';
import { BlogItemType } from '../models/output';

export const blogMapper = (blog: WithId<BlogBdType>): BlogItemType => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    websiteUrl: blog.websiteUrl,
    description: blog.description,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};
