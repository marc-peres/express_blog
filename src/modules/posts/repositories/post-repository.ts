import { postsCollection } from '../../../db/db';
import { InputCreatePostType } from '../models/input';
import { DeleteResult, InsertOneResult, ObjectId, OptionalId, UpdateResult, WithId } from 'mongodb';

import { PostBdType } from '../../../db/models/db';

export class PostRepository {
  static async getAllPosts(): Promise<WithId<PostBdType>[]> {
    return await postsCollection.find({}).toArray();
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
