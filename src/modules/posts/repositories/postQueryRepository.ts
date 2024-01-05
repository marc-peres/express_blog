import { InputPostQueryType } from '../models/input';
import { PostItemOutputType, PostPaginationOutputType } from '../models/output';
import { postMapper } from '../mappers/postMapper';
import { postsCollection } from '../../../db/db';
import { Filter, ObjectId } from 'mongodb';
import { PostBdType } from '../../../db/models/db';

export class PostQueryRepository {
  static async getAllPosts(sortData: InputPostQueryType): Promise<PostPaginationOutputType> {
    const blogId = sortData.blogId ?? '';
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? 'desc';
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const skipCount = (pageNumber - 1) * pageSize;

    let filter = {};

    if (blogId) {
      filter = {
        blogId,
      };
    }

    const posts = await postsCollection.find(filter).sort(sortBy, sortDirection).skip(skipCount).limit(+pageSize).toArray();

    const totalCount = await this.getTotalPostsCount(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: posts.map(postMapper),
    };
  }

  static async findPostById(id: string): Promise<PostItemOutputType | null> {
    const searchedId = new ObjectId(id);
    const post = await postsCollection.findOne({ _id: searchedId });

    if (!post) {
      return null;
    }

    return postMapper(post);
  }

  static async getTotalPostsCount(filter: Filter<PostBdType>): Promise<number> {
    return await postsCollection.countDocuments(filter);
  }
}
