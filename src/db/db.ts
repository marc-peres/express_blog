import { BlogDbType, PostDbType, UsersDbType } from './models/db';
import { MongoClient } from 'mongodb';
import { envVariables } from '../common/env';

const port = envVariables.PORT;

const uri = envVariables.MONGO_DEV_DB_URI || envVariables.MONGO_LOCAL_DB_URI;

if (!uri) {
  throw new Error('! incorrect URI');
}

const client = new MongoClient(uri);
export const dataBase = client.db('blogs-hws');
export const blogsCollection = dataBase.collection<BlogDbType>('blogs');
export const postsCollection = dataBase.collection<PostDbType>('posts');
export const usersCollection = dataBase.collection<UsersDbType>('users');

export const runDb = async () => {
  try {
    await client.connect();
    console.log(`App start on port ${port}`);
    console.log(`Client connected to DB`);
  } catch (e) {
    console.warn('Run DB connect Error', e);
  }
};
