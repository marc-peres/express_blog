import { db } from '../db/db';
import { CreatePostType } from '../models/posts/input';
import { PostItemType } from '../models/posts/output';
import { BlogItemType } from '../models/blogs/output';
import { PutRequestType } from '../models/common';
import { BlogIdParamType } from '../models/blogs/input';

export class PostRepository {
  static getAllPosts() {
    return db.posts;
  }

  static createNewPost(body: CreatePostType, currentBlog: BlogItemType): PostItemType {
    const { content, shortDescription, title, blogId } = body;
    const id = new Date().toISOString();

    const newPost: PostItemType = {
      id,
      content,
      shortDescription,
      title,
      blogId,
      blogName: currentBlog?.name,
    };

    db.posts.push(newPost);

    return newPost;
  }

  static findPostById(id: string): PostItemType | undefined {
    return db.posts.find(i => i.id === id);
  }

  static changePost(req: PutRequestType<BlogIdParamType, CreatePostType>): boolean {
    const { content, blogId, shortDescription, title } = req.body;
    const id = req.params.id;

    let indexOfRequestedPost = -1;
    const requestedPost = db.posts.find((item, index) => {
      if (item.id === id) {
        indexOfRequestedPost = index;
      }
      return item.id === id;
    });

    if (!requestedPost) {
      return false;
    }

    db.posts[indexOfRequestedPost].content = content;
    db.posts[indexOfRequestedPost].blogId = blogId;
    db.posts[indexOfRequestedPost].shortDescription = shortDescription;
    db.posts[indexOfRequestedPost].title = title;

    return true;
  }

  static deletePostById(id: string): void {
    db.posts = db.posts.filter(i => i.id !== id);
  }

  static deleteAllPosts(): void {
    db.posts = [];
  }
}
