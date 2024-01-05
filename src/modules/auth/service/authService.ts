import { UserQueryRepository } from '../../users/repositories/userQueryRepository';
import { Filter } from 'mongodb';
import { UsersBdType } from '../../../db/models/db';
import { UserService } from '../../users/service/userService';

export class AuthService {
  static async checkCredentials(login: string, password: string): Promise<boolean> {
    const filter: Filter<UsersBdType> = {
      $or: [{ login: login }, { email: login }],
    };

    const user = await UserQueryRepository.findUserByFilter(filter);
    if (!user) {
      return false;
    }

    const passwordHash = await UserService.generateHash(password, user.passwordSalt);

    return passwordHash === user.passwordHash;
  }
}
