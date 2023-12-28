import { blogsCollection } from '../../../db/db';
import { DeleteResult, Filter, InsertOneResult, ObjectId, OptionalId, UpdateResult, WithId } from 'mongodb';
import { InputCreateBlogType } from '../models/input';
import { BlogBdType } from '../../../db/models/db';
import { GetAllBlogsWithFilterSortAndPagination } from '../models/repositoryModels';
export class BlogRepository {
  static async getAllBlogs({
    filter = {},
    sortBy = 'createdAt',
    sortDirection = 'desc',
    pagination,
  }: GetAllBlogsWithFilterSortAndPagination): Promise<WithId<BlogBdType>[]> {
    if (pagination) {
      return await blogsCollection
        .find(filter)
        .sort(sortBy, sortDirection)
        .skip(pagination.skipCount)
        .limit(pagination.skipCount)
        .toArray();
    }
    return await blogsCollection.find(filter).sort(sortBy, sortDirection).toArray();
  }

  static async getTotalBlogsCount(filter?: Filter<BlogBdType>): Promise<number> {
    return await blogsCollection.countDocuments(filter);
  }

  static async findBlogById(id: ObjectId): Promise<WithId<BlogBdType> | null> {
    return await blogsCollection.findOne({ _id: id });
  }

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
