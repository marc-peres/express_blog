import { postsCollection } from '../../../db/db';
import { InputCreatePostType } from '../models/input';
import { DeleteResult, InsertOneResult, ObjectId, OptionalId, UpdateResult } from 'mongodb';
import { PostBdType } from '../../../db/models/db';

export class PostRepository {
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
