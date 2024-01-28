import { UserQueryRepository } from '../../users/repositories/userQueryRepository';
import { Filter, WithId } from 'mongodb';
import { UsersDbType } from '../../../db/models/db';
import { UserService } from '../../users/service/userService';
import { emailManager } from '../../../utils/managers/emailManager';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  static async checkCredentials(login: string, password: string): Promise<WithId<UsersDbType> | null> {
    const filter: Filter<UsersDbType> = {
      $or: [{ login: login }, { email: login }],
    };

    const user = await UserQueryRepository.findUserByFilter(filter);
    if (!user || !user.emailConfirmation.isConfirmed) {
      return null;
    }

    const passwordHash = await UserService.generateHash(password, user.passwordSalt);

    if (passwordHash === user.passwordHash) {
      return user;
    }
    return null;
  }

  static async resendingConfirm(email: string): Promise<boolean> {
    const newConfirmCode = uuidv4();
    const user = await UserQueryRepository.findUserByFilter({ email: email });
    if (!user) return false;
    const isUpdated = await UserService.updateConfirmationCode(user._id, newConfirmCode);
    if (!isUpdated) return false;
    const newUser = await UserQueryRepository.findUserByFilter({ email: email });
    if (user?.emailConfirmation?.isConfirmed) return false;
    try {
      await emailManager.sendEmailRecoveryMessage(newUser!);
      return true;
    } catch (e) {
      console.log('sendEmailRecoveryMessageError', e);
      return false;
    }
  }
}
