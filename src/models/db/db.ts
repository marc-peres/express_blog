import { VideosDbType } from '../videos';
import { BlogItemType } from '../blogs/output';

export type DbType = {
  videos: VideosDbType[];
  blogs: BlogItemType[];
};
