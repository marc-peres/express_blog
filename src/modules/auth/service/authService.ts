import { UserQueryRepository } from '../../users/repositories/userQueryRepository';
import { Filter, WithId } from 'mongodb';
import { UsersDbType } from '../../../db/models/db';
import { UserService } from '../../users/service/userService';

export class AuthService {
  static async checkCredentials(login: string, password: string): Promise<WithId<UsersDbType> | null> {
    const filter: Filter<UsersDbType> = {
      $or: [{ login: login }, { email: login }],
    };

    const user = await UserQueryRepository.findUserByFilter(filter);
    if (!user) {
      return null;
    }

    const passwordHash = await UserService.generateHash(password, user.passwordSalt);

    if (passwordHash === user.passwordHash) {
      return user;
    }
    return null;
  }
}
