import { Filter, SortDirection } from 'mongodb';
import { BlogDbType } from '../../../db/models/db';

export type GetAllBlogsWithFilterSortAndPagination = {
  filter?: Filter<BlogDbType>;
  sortBy?: string;
  sortDirection?: SortDirection;
  skipCount: number;
  pageSize: number;
};
