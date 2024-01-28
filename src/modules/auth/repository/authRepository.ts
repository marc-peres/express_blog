import { UserQueryRepository } from '../../users/repositories/userQueryRepository';
import { UserService } from '../../users/service/userService';
import { UserItemOutputType } from '../../users/models/output';
import { UserRepository } from '../../users/repositories/userRepository';

export const authRepository = {
  async registrationWithConfirm(email: string, login: string, password: string): Promise<UserItemOutputType | null> {
    // save to repo
    // get user from repo
    const user = await UserQueryRepository.findUserByFilter({
      $or: [{ login: login }, { email: email }],
    });

    if (user) {
      return null;
    }

    // create user
    return await UserService.createUserWithConfirmation({ login, email, password });
  },

  async confirmationEmailByCode(code: string): Promise<boolean> {
    const user = await UserQueryRepository.findUserByFilter({ 'emailConfirmation.confirmationCode': code });
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.confirmationCode !== code) return false;
    if (!user.emailConfirmation.expirationDate) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;

    return await UserRepository.updateConfirmation(user._id);
  },
};
