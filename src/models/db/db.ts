import { VideosDbType } from '../videos';
import { BlogItemType } from '../blogs/output';
import { PostItemType } from '../posts/output';

export type DbType = {
  videos: VideosDbType[];
  blogs: BlogItemType[];
  posts: PostItemType[];
};
