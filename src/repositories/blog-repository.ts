import { db } from '../db/db';
import { BlogItemType } from '../models/blogs/output';
import { CreateBlogType } from '../models/blogs/input';

export class BlogRepository {
  static getAllBlogs(): BlogItemType[] {
    return db.blogs;
  }

  static findBlogById(id: string): BlogItemType | undefined {
    return db.blogs.find(i => i.id === id);
  }

  static createNewBlog(body: CreateBlogType): BlogItemType {
    const { name, websiteUrl, description } = body;
    const id = new Date().toISOString();

    const newBlog: BlogItemType = {
      id,
      name,
      websiteUrl,
      description,
    };

    db.blogs.push(newBlog);

    return newBlog;
  }

  static changeBlog(body: CreateBlogType, id: string): boolean {
    const { name, websiteUrl, description } = body;

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

  static deleteBlogById(id: string): void {
    db.blogs = db.blogs.filter(i => i.id !== id);
  }

  static deleteAllBlogs(): boolean {
    db.blogs = [];
    return !db.blogs.length;
  }
}
