import { blogsCollection } from '../../../db/db';
import { DeleteResult, InsertOneResult, ObjectId, OptionalId, UpdateResult } from 'mongodb';
import { InputCreateBlogType } from '../models/input';
import { BlogDbType } from '../../../db/models/db';
export class BlogRepository {
  static async createNewBlog(newBlog: OptionalId<BlogDbType>): Promise<InsertOneResult<BlogDbType>> {
    return await blogsCollection.insertOne(newBlog);
  }

  static async updateBlog(id: ObjectId, updateData: InputCreateBlogType): Promise<UpdateResult<BlogDbType>> {
    return await blogsCollection.updateOne(
      { _id: id },
      {
        $set: updateData,
      },
    );
  }

  static async deleteBlogById(id: ObjectId): Promise<DeleteResult> {
    return await blogsCollection.deleteOne({ _id: id });
  }

  static async deleteAllBlogs(): Promise<DeleteResult> {
    return await blogsCollection.deleteMany({});
  }
}
