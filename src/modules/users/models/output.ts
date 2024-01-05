export type UserPaginationOutputType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<UserItemOutputType>;
};

export type UserItemOutputType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
