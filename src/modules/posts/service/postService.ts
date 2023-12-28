import { PostItemType } from '../models/output';
import { postMapper } from '../mappers/postMapper';
import { ObjectId } from 'mongodb';
import { InputCreatePostType } from '../models/input';
import { BlogItemType } from '../../blogs';
import { PostRepository } from '../repositories/post-repository';

export class PostService {
  static async getAllPosts(): Promise<PostItemType[]> {
    const posts = await PostRepository.getAllPosts();
    return posts.map(postMapper);
  }

  static async findPostById(id: string): Promise<PostItemType | null> {
    const searchedId = new ObjectId(id);
    const post = await await PostRepository.findPostById(searchedId);

    if (!post) {
      return null;
    }

    return postMapper(post);
  }

  static async createNewPost(createData: InputCreatePostType, currentBlog: BlogItemType): Promise<PostItemType> {
    const createdAt = new Date().toISOString();
    const newPost = {
      ...createData,
      blogName: currentBlog?.name,
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
    const posts = await PostRepository.getAllPosts();
    const postsLength = posts.length;
    const post = await PostRepository.deleteAllPosts();
    return postsLength === post.deletedCount;
  }
}
