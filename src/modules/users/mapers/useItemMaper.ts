import { WithId } from 'mongodb';
import { UsersDbType } from '../../../db/models/db';
import { UserItemOutputType } from '../models/output';

export const useItemMapper = (user: WithId<UsersDbType>): UserItemOutputType => {
  return {
    id: user._id.toString(),
    email: user.email,
    createdAt: user.createdAt,
    login: user.login,
  };
};
