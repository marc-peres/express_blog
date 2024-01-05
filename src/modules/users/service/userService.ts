import { InputPostUsersType } from '../models/input';
import { UserItemOutputType } from '../models/output';
import { UserRepository } from '../repositories/userRepository';
import { ObjectId } from 'mongodb';
import { UserQueryRepository } from '../repositories/userQueryRepository';
const bcrypt = require('bcrypt');

export class UserService {
  static async createUser(createData: InputPostUsersType): Promise<UserItemOutputType> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.generateHash(createData.password, passwordSalt);

    const createdAt = new Date().toISOString();
    const newUser = {
      login: createData.login,
      email: createData.email,
      passwordSalt: passwordHash,
      passwordHash: passwordHash,
      createdAt,
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

  static async deleteAllUser(): Promise<boolean> {
    const userCount = await UserQueryRepository.getTotalUsersCount();
    const users = await UserRepository.deleteAllBlogs();
    return users.deletedCount === userCount;
  }
}
