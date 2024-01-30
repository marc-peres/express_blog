import { UserQueryRepository } from '../../users/repositories/userQueryRepository';
import { Filter, WithId } from 'mongodb';
import { UsersDbType } from '../../../db/models/db';
import { UserService } from '../../users/service/userService';
import { emailManager } from '../../../utils/managers/emailManager';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '../../../application/services/jwtService';
import { AuthQueryRepository } from '../repository/authQueryRepository';

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

  static async refreshTokens(oldRefreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const result = await JwtService.getUserInfoByToken(oldRefreshToken, 'refresh');
      if (!result) {
        return null;
      }
      const { userId, email, login } = result;
      const blackList = await AuthQueryRepository.findTokenInBlackList({ expiredToken: oldRefreshToken });
      if (blackList?._id) {
        return null;
      } else {
        const createdAt = new Date();
        await AuthQueryRepository.addRefreshTokenToBlackList({
          expiredToken: oldRefreshToken,
          createdAt: createdAt.toISOString(),
        });
      }
      return await JwtService.createJWT(userId!, email, login);
    } catch (e) {
      console.log('refreshTokensReq', e);
      return null;
    }
  }

  static async logOut(oldRefreshToken: string): Promise<boolean> {
    try {
      const result = await JwtService.getUserInfoByToken(oldRefreshToken, 'refresh');
      if (!result) {
        return false;
      }
      const blackList = await AuthQueryRepository.findTokenInBlackList({ expiredToken: oldRefreshToken });
      if (blackList?._id) {
        return false;
      } else {
        const createdAt = new Date();
        await AuthQueryRepository.addRefreshTokenToBlackList({ expiredToken: oldRefreshToken, createdAt: createdAt.toISOString() });
      }
      return true;
    } catch (e) {
      console.log('logOutReq', e);
      return false;
    }
  }
}
