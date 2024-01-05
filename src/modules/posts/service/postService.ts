import { PostItemOutputType } from '../models/output';
import { ObjectId } from 'mongodb';
import { InputCreatePostType } from '../models/input';
import { PostRepository } from '../repositories/postRepository';
import { PostQueryRepository } from '../repositories/postQueryRepository';

export class PostService {
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
    const postsLength = await PostQueryRepository.getTotalPostsCount({});
    const post = await PostRepository.deleteAllPosts();
    return postsLength === post.deletedCount;
  }
}
