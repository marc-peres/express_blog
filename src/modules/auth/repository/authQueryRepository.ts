import { expiredTokenCollection } from '../../../db/db';
import { ExpiredTokenType } from '../../../db/models/db';
import { Filter, InsertOneResult, WithId } from 'mongodb';

export class AuthQueryRepository {
  static async addRefreshTokenToBlackList(expiredTokenObj: ExpiredTokenType): Promise<InsertOneResult<ExpiredTokenType>> {
    return await expiredTokenCollection.insertOne(expiredTokenObj);
  }

  static async findTokenInBlackList(filter: Filter<ExpiredTokenType>): Promise<WithId<ExpiredTokenType> | null> {
    return await expiredTokenCollection.findOne(filter);
  }
}
