import { db } from '../db/db';
import { BlogItemType } from '../models/blogs/output';
import { BlogIdParamType, PostBlogType } from '../models/blogs/input';
import { PutRequestType } from '../models/common';

export class BlogRepository {
  static getAllBlogs(): BlogItemType[] {
    return db.blogs;
  }

  static findBlogById(id: number): BlogItemType | undefined {
    return db.blogs.find(i => i.id === id);
  }

  static createNewBlog(body: PostBlogType): BlogItemType {
    const { name, websiteUrl, description } = body;
    const id = +new Date();

    const newBlog: BlogItemType = {
      id,
      name,
      websiteUrl,
      description,
    };

    db.blogs.push(newBlog);

    return newBlog;
  }

  static changeBlog(req: PutRequestType<BlogIdParamType, PostBlogType>): boolean {
    const { name, websiteUrl, description } = req.body;
    const id = +req.params.id;

    let indexOfRequestedBlog = -1;
    const requestedBlog = db.blogs.find((item, index) => {
      if (item.id === id) {
        indexOfRequestedBlog = index;
      }
      return item.id === id;
    });

    if (!requestedBlog) {
      return false;
    }

    db.blogs[indexOfRequestedBlog].name = name;
    db.blogs[indexOfRequestedBlog].websiteUrl = websiteUrl;
    db.blogs[indexOfRequestedBlog].description = description;

    return true;
  }

  static deleteBlogById(id: number): void {
    db.blogs = db.blogs.filter(i => i.id !== id);
  }

  static deleteAllBlogs(): boolean {
    db.blogs = [];
    return !db.blogs.length;
  }
}
