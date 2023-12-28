import { postsCollection } from '../../../db/db';
import { InputCreatePostType } from '../models/input';
import { DeleteResult, Filter, InsertOneResult, ObjectId, OptionalId, UpdateResult, WithId } from 'mongodb';

import { PostBdType } from '../../../db/models/db';
import { GetAllPostsWithFilterSort } from '../models/repositoryModels';

export class PostRepository {
  static async getAllPosts({
    filter = {},
    sortBy = 'createdAt',
    sortDirection = 'desc',
    pagination,
  }: GetAllPostsWithFilterSort): Promise<WithId<PostBdType>[]> {
    if (pagination) {
      return await postsCollection
        .find(filter)
        .sort(sortBy, sortDirection)
        .skip(pagination.skipCount)
        .limit(pagination.limitCount)
        .toArray();
    }
    return await postsCollection.find(filter).sort(sortBy, sortDirection).toArray();
  }

  static async getTotalPostsCount(filter?: Filter<PostBdType>): Promise<number> {
    return await postsCollection.countDocuments(filter);
  }

  static async findPostById(id: ObjectId): Promise<WithId<PostBdType> | null> {
    return await postsCollection.findOne({ _id: id });
  }

  static async createNewPost(newPost: OptionalId<PostBdType>): Promise<InsertOneResult<PostBdType>> {
    return await postsCollection.insertOne(newPost);
  }

  static async changePost(id: ObjectId, updatedPost: InputCreatePostType): Promise<UpdateResult<PostBdType>> {
    return await postsCollection.updateOne(
      { _id: id },
      {
        $set: updatedPost,
      },
    );
  }

  static async deletePostById(id: ObjectId): Promise<DeleteResult> {
    return await postsCollection.deleteOne({ _id: id });
  }

  static async deleteAllPosts(): Promise<DeleteResult> {
    return await postsCollection.deleteMany({});
  }
}
