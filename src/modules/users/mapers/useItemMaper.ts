import { WithId } from 'mongodb';
import { UsersBdType } from '../../../db/models/db';
import { UserItemOutputType } from '../models/output';

export const useItemMapper = (user: WithId<UsersBdType>): UserItemOutputType => {
  return {
    id: user._id.toString(),
    email: user.email,
    createdAt: user.createdAt,
    login: user.login,
  };
};
