import { WithId } from 'mongodb';
import { BlogDbType } from '../../../db/models/db';
import { BlogItemOutputType } from '../models/output';

export const blogMapper = (blog: WithId<BlogDbType>): BlogItemOutputType => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    websiteUrl: blog.websiteUrl,
    description: blog.description,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
  };
};
