import { SortDirection } from 'mongodb';

export type InputCreatePostType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type InputPostQueryType = {
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
  blogId?: string;
};
