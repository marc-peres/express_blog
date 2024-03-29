import { SortDirection } from 'mongodb';

export type InputUsersWithQueryType = {
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

export type InputPostUsersType = {
  login: string;
  password: string;
  email: string;
};

export type InputPostUsersWithPasswordHashType = {
  login: string;
  email: string;
  createdAt: string;
  passwordSalt: string;
  passwordHash: string;
  emailConfirmation: {
    confirmationCode: string | null;
    expirationDate: Date | null;
    isConfirmed: boolean;
  };
};

export type UserIdParamType = { id: string };
