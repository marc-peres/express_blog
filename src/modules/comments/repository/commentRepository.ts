import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from 'mongodb';
import { PutCommentInputType } from '../models/input';
import { CommentsDbType } from '../../../db/models/db';
import { commentsCollection } from '../../../db/db';

export class CommentRepository {
  static async createCommentByPostId(newComment: CommentsDbType): Promise<InsertOneResult<CommentsDbType>> {
    return await commentsCollection.insertOne(newComment);
  }
  static async changeComment(id: ObjectId, updatedComment: PutCommentInputType): Promise<UpdateResult<CommentsDbType>> {
    return await commentsCollection.updateOne({ _id: id }, { $set: updatedComment });
  }

  static async deleteCommentById(id: ObjectId): Promise<DeleteResult> {
    return await commentsCollection.deleteOne({ _id: id });
  }

  static async deleteAllComment(): Promise<DeleteResult> {
    return await commentsCollection.deleteMany({});
  }
}
