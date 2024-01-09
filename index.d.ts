import { UsersDbType } from './src/db/models/db';
import { WithId } from 'mongodb';

declare global {
  namespace Express {
    export interface Request {
      user: WithId<UsersDbType> | null;
    }
  }
}
