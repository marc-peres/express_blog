var jwt = require('jsonwebtoken');
import { UsersDbType } from '../../db/models/db';
import { ObjectId, WithId } from 'mongodb';
import { envVariables } from '../../common/env';

export class JwtService {
  static async createJWT(user: WithId<UsersDbType>) {
    const token = jwt.sign({ userId: user._id }, envVariables.JWT_SECRET, { expiresIn: '1d' });

    return {
      accessToken: token,
    };
  }

  static async getUserIdByToken(token: string): Promise<ObjectId | null> {
    try {
      const result = jwt.verify(token, envVariables.JWT_SECRET);
      return new ObjectId(result.userId);
    } catch (e) {
      // console.log('verify error', e);
      return null;
    }
  }
}
