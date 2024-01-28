import { InputPostUsersWithPasswordHashType } from '../models/input';
import { usersCollection } from '../../../db/db';
import { UsersDbType } from '../../../db/models/db';
import { DeleteResult, InsertOneResult, ObjectId } from 'mongodb';

export class UserRepository {
  static async createUser(createData: InputPostUsersWithPasswordHashType): Promise<InsertOneResult<UsersDbType>> {
    return await usersCollection.insertOne(createData);
  }
  static async updateConfirmation(_id: ObjectId): Promise<boolean> {
    const result = await usersCollection.updateOne({ _id }, { $set: { 'emailConfirmation.isConfirmed': true } });
    return result.modifiedCount === 1;
  }
  static async updateConfirmationCode(_id: ObjectId, code: any): Promise<boolean> {
    const result = await usersCollection.updateOne({ _id }, { $set: { 'emailConfirmation.confirmationCode': code } });
    return result.modifiedCount === 1;
  }

  static async deleteUserById(id: ObjectId): Promise<DeleteResult> {
    return await usersCollection.deleteOne({ _id: id });
  }

  static async deleteAllBlogs(): Promise<DeleteResult> {
    return await usersCollection.deleteMany();
  }
}
