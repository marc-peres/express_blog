import { InputBlogWithQueryType } from '../models/input';
import { BlogItemOutputType, BlogPaginationOutputType } from '../models/output';
import { blogMapper } from '../mappers/mapper';
import { blogsCollection } from '../../../db/db';
import { Filter, ObjectId } from 'mongodb';
import { BlogBdType } from '../../../db/models/db';

export class BlogQueryRepository {
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

    const blogs = await blogsCollection.find(filter).sort(sortBy, sortDirection).skip(skipCount).limit(+pageSize).toArray();

    const totalCount = await this.getTotalBlogsCount(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: blogs.map(blogMapper),
    };
  }

  static async findBlogById(id: string): Promise<BlogItemOutputType | null> {
    const searchedId = new ObjectId(id);
    const blog = await blogsCollection.findOne({ _id: searchedId });

    if (!blog) {
      return null;
    }

    return blogMapper(blog);
  }

  static async getTotalBlogsCount(filter?: Filter<BlogBdType>): Promise<number> {
    return await blogsCollection.countDocuments(filter);
  }
}
