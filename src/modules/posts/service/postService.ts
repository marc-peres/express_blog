import { PostItemOutputType, PostPaginationOutputType } from '../models/output';
import { postMapper } from '../mappers/postMapper';
import { ObjectId } from 'mongodb';
import { InputCreatePostType, InputPostQueryType } from '../models/input';
import { PostRepository } from '../repositories/post-repository';

export class PostService {
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

    const posts = await PostRepository.getAllPosts({ filter, sortBy, sortDirection, skipCount, pageSize });

    const totalCount = await PostRepository.getTotalPostsCount(filter);
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
    const post = await await PostRepository.findPostById(searchedId);

    if (!post) {
      return null;
    }

    return postMapper(post);
  }

  static async createNewPost(createData: InputCreatePostType, blogName: string): Promise<PostItemOutputType> {
    const createdAt = new Date().toISOString();
    const newPost = {
      ...createData,
      blogName,
      createdAt,
    };
    const post = await PostRepository.createNewPost({ ...newPost });

    return {
      ...newPost,
      id: post.insertedId.toString(),
    };
  }

  static async changePost(updatedData: InputCreatePostType, id: string): Promise<boolean> {
    const updatedId = new ObjectId(id);
    const updatedPost = {
      title: updatedData.title,
      shortDescription: updatedData.shortDescription,
      content: updatedData.content,
      blogId: updatedData.blogId,
    };
    const post = await PostRepository.changePost(updatedId, updatedPost);

    return !!post.matchedCount;
  }

  static async deletePostById(id: string): Promise<boolean> {
    const deletedId = new ObjectId(id);
    const post = await await PostRepository.deletePostById(deletedId);
    return !!post.deletedCount;
  }

  static async deleteAllPosts(): Promise<boolean> {
    const postsLength = await PostRepository.getTotalPostsCount({});
    const post = await PostRepository.deleteAllPosts();
    return postsLength === post.deletedCount;
  }
}
