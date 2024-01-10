import { CommentItemOutputType, CommentsPaginationOutputType } from '../models/output';
import { Filter, ObjectId } from 'mongodb';
import { commentsCollection } from '../../../db/db';
import { commentMapper } from '../mappers/commentMapper';
import { InputCommentsWithQueryType } from '../models/input';
import { CommentsDbType } from '../../../db/models/db';

export class CommentsQueryRepository {
  static async getAllComment(sortData: InputCommentsWithQueryType): Promise<CommentsPaginationOutputType> {
    const postId = sortData.postId ?? '';
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? 'desc';
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const skipCount = (pageNumber - 1) * pageSize;

    let filter = {};

    if (postId) {
      filter = {
        postId,
      };
    }

    const comments = await commentsCollection.find(filter).sort(sortBy, sortDirection).skip(+skipCount).limit(+pageSize).toArray();
    const totalCount = await this.getCommentTotalCount(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: comments.map(commentMapper),
    };
  }
  static async getCommentById(id: string): Promise<CommentItemOutputType | null> {
    const searchedId = new ObjectId(id);
    const comment = await commentsCollection.findOne({ _id: searchedId });

    if (!comment) {
      return null;
    }

    return commentMapper(comment);
  }

  static async getCommentTotalCount(filter: Filter<CommentsDbType>) {
    return await commentsCollection.countDocuments(filter);
  }
}
