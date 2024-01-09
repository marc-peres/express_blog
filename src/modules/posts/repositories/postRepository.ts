import { postsCollection } from '../../../db/db';
import { InputCreatePostType } from '../models/input';
import { DeleteResult, InsertOneResult, ObjectId, OptionalId, UpdateResult } from 'mongodb';
import { PostDbType } from '../../../db/models/db';

export class PostRepository {
  static async createNewPost(newPost: OptionalId<PostDbType>): Promise<InsertOneResult<PostDbType>> {
    return await postsCollection.insertOne(newPost);
  }

  static async changePost(id: ObjectId, updatedPost: InputCreatePostType): Promise<UpdateResult<PostDbType>> {
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
