import { InputPostUsersType, InputPostUsersWithPasswordHashType } from '../models/input';
import { UserItemOutputType } from '../models/output';
import { UserRepository } from '../repositories/userRepository';
import { ObjectId } from 'mongodb';
import { UserQueryRepository } from '../repositories/userQueryRepository';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns/add';
import { emailManager } from '../../../utils/managers/emailManager';
const bcrypt = require('bcrypt');

export class UserService {
  static async createUserWithConfirmation(createData: InputPostUsersType): Promise<UserItemOutputType | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.generateHash(createData.password, passwordSalt);

    const createdAt = new Date().toISOString();
    const newUser: InputPostUsersWithPasswordHashType = {
      login: createData.login,
      email: createData.email,
      passwordSalt: passwordHash,
      passwordHash: passwordHash,
      createdAt,
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 3,
        }),
        isConfirmed: false,
      },
    };

    const user = await UserRepository.createUser({ ...newUser });
    try {
      await emailManager.sendEmailRecoveryMessage(newUser);
    } catch (e) {
      console.log('sendEmailRecoveryMessageError', e);
      this.deleteUserById(user.insertedId.toString());
      return null;
    }
    return {
      id: user.insertedId.toString(),
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  }

  static async createConfirmedUser(createData: InputPostUsersType): Promise<UserItemOutputType | null> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.generateHash(createData.password, passwordSalt);

    const createdAt = new Date().toISOString();
    const newUser: InputPostUsersWithPasswordHashType = {
      login: createData.login,
      email: createData.email,
      passwordSalt: passwordHash,
      passwordHash: passwordHash,
      createdAt,
      emailConfirmation: {
        isConfirmed: true,
        confirmationCode: null,
        expirationDate: null,
      },
    };

    const user = await UserRepository.createUser({ ...newUser });

    return {
      id: user.insertedId.toString(),
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  }

  static async generateHash(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  static async deleteUserById(id: string): Promise<boolean> {
    const deletedUserId = new ObjectId(id);
    const user = await UserRepository.deleteUserById(deletedUserId);
    return !!user.deletedCount;
  }
  static async updateConfirmationCode(id: ObjectId, code: any): Promise<boolean> {
    return await UserRepository.updateConfirmationCode(id, code);
  }

  static async deleteAllUser(): Promise<boolean> {
    const userCount = await UserQueryRepository.getTotalUsersCount();
    const users = await UserRepository.deleteAllBlogs();
    return users.deletedCount === userCount;
  }
}
