import { Filter, SortDirection } from 'mongodb';
import { PostBdType } from '../../../db/models/db';

export type GetAllPostsWithFilterSort = {
  filter?: Filter<PostBdType>;
  sortBy?: string;
  sortDirection?: SortDirection;
  pagination?: {
    skipCount: number;
    limitCount: number;
  };
};
