import { blogsCollection } from '../../../db/db';
import { blogMapper } from '../mappers/mapper';
import { ObjectId } from 'mongodb';
import { BlogItemType } from '../models/output';
import { CreateBlogType } from '../models/input';
export class BlogRepository {
  static async getAllBlogs(): Promise<BlogItemType[]> {
    const blogs = await blogsCollection.find({}).toArray();
    return blogs.map(blogMapper);
  }

  static async findBlogById(id: string): Promise<BlogItemType | null> {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return null;
    }

    return blogMapper(blog);
  }

  static async createNewBlog(createData: CreateBlogType): Promise<BlogItemType> {
    const createdAt = new Date().toISOString();
    const blog = await blogsCollection.insertOne({
      ...createData,
      isMembership: false,
      createdAt,
    });

    return {
      ...createData,
      isMembership: false,
      createdAt,
      id: blog.insertedId.toString(),
    };
  }

  static async updateBlog(updateData: CreateBlogType, id: string): Promise<boolean> {
    const blog = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          websiteUrl: updateData.websiteUrl,
          name: updateData.name,
          description: updateData.description,
        },
      },
    );

    return !!blog.matchedCount;
  }

  static async deleteBlogById(id: string): Promise<boolean> {
    const blog = await blogsCollection.deleteOne({ _id: new ObjectId(id) });

    return !!blog.deletedCount;
  }

  static async deleteAllBlogs(): Promise<boolean> {
    const blogsCount = await blogsCollection
      .find({})
      .toArray()
      .then(res => res.length);
    const blog = await blogsCollection.deleteMany({});
    return blog.deletedCount === blogsCount;
  }
}
