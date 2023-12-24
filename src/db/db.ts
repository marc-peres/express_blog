import { BlogBdType, PostBdType } from '../models/db/db';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();
if (!process.env.PORT) {
  throw new Error(` ! process.env.PORT doesn't found`);
}
if (!process.env.MONGO_URI) {
  throw new Error(` ! process.env.MONGO_URI doesn't found`);
}
if (!process.env.MONGO_LOCAL_URI) {
  throw new Error(` ! process.env.MONGO_LOCAL_URI doesn't found`);
}
const port = process.env.PORT;

const uri = process.env.MONGO_LOCAL_URI || process.env.MONGO_URI;

const client = new MongoClient(uri);
export const dataBase = client.db('blogs-hws');
export const blogsCollection = dataBase.collection<BlogBdType>('blogs');
export const postsCollection = dataBase.collection<PostBdType>('posts');

export const runDb = async () => {
  try {
    await client.connect();
    console.log(`App start on port ${port}`);
    console.log(`Client connected to DB`);
  } catch (e) {
    console.warn('Run DB connect Error', e);
  }
};
