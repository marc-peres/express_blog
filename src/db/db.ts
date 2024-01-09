import { BlogBdType, PostBdType, UsersBdType } from './models/db';
import { MongoClient } from 'mongodb';
import { envVariables } from '../common/env';

const port = envVariables.port;

const uri = envVariables.mongoDevDbUri || envVariables.mongoLocalDbUri;

if (!uri) {
  throw new Error('! incorrect URI');
}

const client = new MongoClient(uri);
export const dataBase = client.db('blogs-hws');
export const blogsCollection = dataBase.collection<BlogBdType>('blogs');
export const postsCollection = dataBase.collection<PostBdType>('posts');
export const usersCollection = dataBase.collection<UsersBdType>('users');

export const runDb = async () => {
  try {
    await client.connect();
    console.log(`App start on port ${port}`);
    console.log(`Client connected to DB`);
  } catch (e) {
    console.warn('Run DB connect Error', e);
  }
};
