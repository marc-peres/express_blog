import { postsCollection } from '../db/db';
import { CreatePostType } from '../models/posts/input';
import { PostItemType } from '../models/posts/output';
import { BlogItemType } from '../models/blogs/output';
import { postMapper } from '../models/posts/mappers/postMapper';
import { ObjectId } from 'mongodb';

export class PostRepository {
  static async getAllPosts(): Promise<PostItemType[]> {
    const posts = await postsCollection.find({}).toArray();
    return posts.map(postMapper);
  }

  static async findPostById(id: string): Promise<PostItemType | null> {
    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }

    return postMapper(post);
  }

  static async createNewPost(createData: CreatePostType, currentBlog: BlogItemType): Promise<PostItemType> {
    const createdAt = new Date().toString();
    const post = await postsCollection.insertOne({
      ...createData,
      blogName: currentBlog?.name,
      createdAt,
    });

    return {
      ...createData,
      blogName: currentBlog?.name,
      createdAt,
      id: post.insertedId.toString(),
    };
  }

  static async changePost(updatedData: CreatePostType, id: string): Promise<boolean> {
    const post = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: updatedData.title,
          shortDescription: updatedData.shortDescription,
          content: updatedData.content,
          blogId: updatedData.blogId,
        },
      },
    );

    return !!post.matchedCount;
  }

  static async deletePostById(id: string): Promise<boolean> {
    const post = await postsCollection.deleteOne({ _id: new ObjectId(id) });
    return !!post.deletedCount;
  }

  static async deleteAllPosts(): Promise<boolean> {
    const postsLength = await postsCollection
      .find({})
      .toArray()
      .then(res => res.length);
    const post = await postsCollection.deleteMany({});
    return postsLength === post.deletedCount;
  }
}
