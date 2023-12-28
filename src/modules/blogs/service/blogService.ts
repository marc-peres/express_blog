import { BlogItemOutputType, BlogPaginationOutputType } from '../models/output';
import { blogMapper } from '../mappers/mapper';
import { ObjectId } from 'mongodb';
import { InputBlogWithQueryType, InputCreateBlogType } from '../models/input';
import { BlogRepository } from '../repositories/blog-repository';
export class BlogService {
  static async getAllBlogs(sortData: InputBlogWithQueryType): Promise<BlogPaginationOutputType> {
    const searchNameTerm = sortData.searchNameTerm ?? null;
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? 'desc';
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const skipCount = (pageNumber - 1) * pageSize;

    let filter = {};

    if (searchNameTerm) {
      filter = {
        name: {
          $regex: searchNameTerm,
          $options: 'i',
        },
      };
    }

    const blogs = await BlogRepository.getAllBlogs({
      filter,
      sortBy,
      sortDirection,
      pagination: {
        limitCount: pageSize,
        skipCount,
      },
    });

    const totalCount = await BlogRepository.getTotalBlogsCount(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: blogs.map(blogMapper),
    };
  }

  static async findBlogById(id: string): Promise<BlogItemOutputType | null> {
    const searchedId = new ObjectId(id);
    const blog = await BlogRepository.findBlogById(searchedId);

    if (!blog) {
      return null;
    }

    return blogMapper(blog);
  }

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
    const blogsCount = await BlogRepository.getTotalBlogsCount({});
    const deletedResult = await BlogRepository.deleteAllBlogs();
    return deletedResult.deletedCount === blogsCount;
  }
}
