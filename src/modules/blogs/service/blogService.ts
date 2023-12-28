import { BlogItemType } from '../models/output';
import { blogMapper } from '../mappers/mapper';
import { ObjectId } from 'mongodb';
import { InputCreateBlogType } from '../models/input';
import { BlogRepository } from '../repositories/blog-repository';
export class BlogService {
  static async getAllBlogs(): Promise<BlogItemType[]> {
    const blogs = await BlogRepository.getAllBlogs();
    return blogs.map(blogMapper);
  }

  static async findBlogById(id: string): Promise<BlogItemType | null> {
    const searchedId = new ObjectId(id);
    const blog = await BlogRepository.findBlogById(searchedId);

    if (!blog) {
      return null;
    }

    return blogMapper(blog);
  }

  static async createNewBlog(createData: InputCreateBlogType): Promise<BlogItemType> {
    const createdAt = new Date().toISOString();
    const newBlog = {
      ...createData,
      isMembership: false,
      createdAt,
    };

    const blog = await BlogRepository.createNewBlog({ ...newBlog });

    return {
      ...newBlog,
      id: blog.insertedId.toString(),
    };
  }

  static async updateBlog(updateData: InputCreateBlogType, id: string): Promise<boolean> {
    const updatedBlogId = new ObjectId(id);
    const updatedValues = {
      websiteUrl: updateData.websiteUrl,
      name: updateData.name,
      description: updateData.description,
    };

    const blog = await await BlogRepository.updateBlog(updatedBlogId, { ...updatedValues });

    return !!blog.matchedCount;
  }

  static async deleteBlogById(id: string): Promise<boolean> {
    const deletedBlogId = new ObjectId(id);

    const blog = await BlogRepository.deleteBlogById(deletedBlogId);

    return !!blog.deletedCount;
  }

  static async deleteAllBlogs(): Promise<boolean> {
    const blogs = await BlogRepository.getAllBlogs();
    const blogsCount = blogs.length;
    const deletedResult = await BlogRepository.deleteAllBlogs();
    return deletedResult.deletedCount === blogsCount;
  }
}
