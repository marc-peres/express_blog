import { BlogItemOutputType } from '../models/output';
import { ObjectId } from 'mongodb';
import { InputCreateBlogType } from '../models/input';
import { BlogRepository } from '../repositories/blogRepository';
import { BlogQueryRepository } from '../repositories/blogQueryRepository';
export class BlogService {
  static async createNewBlog(createData: InputCreateBlogType): Promise<BlogItemOutputType> {
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
    const blogsCount = await BlogQueryRepository.getTotalBlogsCount({});
    const deletedResult = await BlogRepository.deleteAllBlogs();
    return deletedResult.deletedCount === blogsCount;
  }
}
