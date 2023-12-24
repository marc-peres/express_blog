import { BlogBdType, PostBdType } from '../models/db/db';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();
const port = process.env.PORT || 3000;

const uri =
  process.env.MONGO_LOCAL_URI ||
  'mongodb://localhost:27017' ||
  process.env.MONGO_URI ||
  'mongodb+srv://peresm:euLCflFNzxuOvhJX@incubator3week.4xlby5h.mongodb.net/';

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
