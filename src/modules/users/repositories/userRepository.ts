import { InputPostUsersWithPasswordHashType } from '../models/input';
import { usersCollection } from '../../../db/db';
import { UsersDbType } from '../../../db/models/db';
import { DeleteResult, InsertOneResult, ObjectId } from 'mongodb';

export class UserRepository {
  static async createUser(createData: InputPostUsersWithPasswordHashType): Promise<InsertOneResult<UsersDbType>> {
    return await usersCollection.insertOne(createData);
  }

  static async deleteUserById(id: ObjectId): Promise<DeleteResult> {
    return await usersCollection.deleteOne({ _id: id });
  }

  static async deleteAllBlogs(): Promise<DeleteResult> {
    return await usersCollection.deleteMany();
  }
}
