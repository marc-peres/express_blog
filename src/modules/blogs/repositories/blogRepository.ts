import { blogsCollection } from '../../../db/db';
import { DeleteResult, InsertOneResult, ObjectId, OptionalId, UpdateResult } from 'mongodb';
import { InputCreateBlogType } from '../models/input';
import { BlogBdType } from '../../../db/models/db';
export class BlogRepository {
  static async createNewBlog(newBlog: OptionalId<BlogBdType>): Promise<InsertOneResult<BlogBdType>> {
    return await blogsCollection.insertOne(newBlog);
  }

  static async updateBlog(id: ObjectId, updateData: InputCreateBlogType): Promise<UpdateResult<BlogBdType>> {
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
