export type BlogDbType = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
export type PostDbType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};
export type UsersDbType = {
  login: string;
  email: string;
  createdAt: string;
  passwordSalt: string;
  passwordHash: string;
};
