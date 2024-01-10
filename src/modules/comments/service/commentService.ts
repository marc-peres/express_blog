import { ObjectId } from 'mongodb';
import { CommentRepository } from '../repository/commentRepository';
import { InputCreateCommentType, PutCommentInputType } from '../models/input';
import { CommentsDbType } from '../../../db/models/db';

export class CommentService {
  static async createCommentByPostId(createData: InputCreateCommentType) {
    const createdAt = new Date().toISOString();
    const newComment: CommentsDbType = {
      ...createData,
      createdAt,
    };

    const createdComment = await CommentRepository.createCommentByPostId(newComment);
    return {
      content: newComment.content,
      commentatorInfo: { userId: newComment.commentatorInfo.userId, userLogin: newComment.commentatorInfo.userLogin },
      createdAt,
      id: createdComment.insertedId.toString(),
    };
  }

  static async changeCommentById(commentId: string, comment: string): Promise<boolean> {
    const updatedCommentId = new ObjectId(commentId);
    const updatedComment: PutCommentInputType = {
      content: comment,
    };
    const updateResult = await CommentRepository.changeComment(updatedCommentId, updatedComment);
    return !!updateResult.matchedCount;
  }

  static async deleteCommentById(commentId: string): Promise<boolean> {
    const deletedCommentId = new ObjectId(commentId);
    const deleteResult = await CommentRepository.deleteCommentById(deletedCommentId);
    return !!deleteResult.deletedCount;
  }

  static async deleteAllComment(): Promise<boolean> {
    const deleteResult = await CommentRepository.deleteAllComment();
    return !!deleteResult.deletedCount;
  }
}
