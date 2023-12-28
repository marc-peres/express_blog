import { Filter, SortDirection } from 'mongodb';
import { BlogBdType } from '../../../db/models/db';

export type GetAllBlogsWithFilterSortAndPagination = {
  filter?: Filter<BlogBdType>;
  sortBy?: string;
  sortDirection?: SortDirection;
  pagination?: {
    skipCount: number;
    limitCount: number;
  };
};
