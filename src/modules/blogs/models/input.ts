import { SortDirection } from 'mongodb';

export type InputCreateBlogType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type InputBlogWithQueryType = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
};

export type BlogIdParamType = { id: string };
