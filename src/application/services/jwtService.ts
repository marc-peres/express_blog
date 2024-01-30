var jwt = require('jsonwebtoken');
import { ObjectId } from 'mongodb';
import { envVariables } from '../../common/env';

export class JwtService {
  static async createJWT(userId: ObjectId, email: string, login: string): Promise<{ accessToken: string; refreshToken: string }> {
    const aToken = jwt.sign({ userId: userId, email: email, login: login }, envVariables.JWT_ACCESS_SECRET, { expiresIn: '10s' });
    const rToken = jwt.sign({ userId: userId, email: email, login: login }, envVariables.JWT_REFRESH_SECRET, { expiresIn: '20s' });

    return {
      accessToken: aToken,
      refreshToken: rToken,
    };
  }

  static async getUserInfoByToken(
    token: string,
    tokenType: 'access' | 'refresh',
  ): Promise<{ userId: ObjectId; email: string; login: string } | null> {
    try {
      const result = jwt.verify(token, tokenType === 'access' ? envVariables.JWT_ACCESS_SECRET : envVariables.JWT_REFRESH_SECRET);
      return { userId: new ObjectId(result.userId), email: result.email, login: result.login };
    } catch (e) {
      // console.log('verify error', e);
      return null;
    }
  }
}
