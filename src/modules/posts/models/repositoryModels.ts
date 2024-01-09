import { Filter, SortDirection } from 'mongodb';
import { PostDbType } from '../../../db/models/db';

export type GetAllPostsWithFilterSort = {
  filter?: Filter<PostDbType>;
  sortBy?: string;
  sortDirection?: SortDirection;
  skipCount: number;
  pageSize: number;
};
