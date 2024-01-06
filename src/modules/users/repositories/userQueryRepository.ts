import { InputUsersWithQueryType } from '../models/input';
import { UserPaginationOutputType } from '../models/output';
import { usersCollection } from '../../../db/db';
import { Filter, WithId } from 'mongodb';
import { UsersBdType } from '../../../db/models/db';
import { useItemMapper } from '../mapers/useItemMaper';

export class UserQueryRepository {
  static async getAllUsers(sortData: InputUsersWithQueryType): Promise<UserPaginationOutputType> {
    const searchLoginTerm = sortData.searchLoginTerm ?? null;
    const searchEmailTerm = sortData.searchEmailTerm ?? null;
    const sortBy = sortData.sortBy ?? 'createdAt';
    const sortDirection = sortData.sortDirection ?? 'desc';
    const pageNumber = sortData.pageNumber ?? 1;
    const pageSize = sortData.pageSize ?? 10;
    const skipCount = (pageNumber - 1) * pageSize;

    let filter = {};

    if (searchLoginTerm || searchEmailTerm) {
      filter = {
        $or: [
          searchLoginTerm
            ? {
                login: {
                  $regex: searchLoginTerm,
                  $options: 'i',
                },
              }
            : {},
          searchEmailTerm
            ? {
                email: {
                  $regex: searchEmailTerm,
                  $options: 'i',
                },
              }
            : {},
        ],
      };
    }

    const users = await usersCollection.find(filter).sort(sortBy, sortDirection).skip(skipCount).limit(+pageSize).toArray();
    const totalCount = await this.getTotalUsersCount(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: users.map(useItemMapper),
    };
  }

  static async getTotalUsersCount(filter?: Filter<UsersBdType>): Promise<number> {
    return await usersCollection.countDocuments(filter);
  }

  static async findUserByFilter(filter: Filter<UsersBdType>): Promise<WithId<UsersBdType> | null> {
    return await usersCollection.findOne(filter);
  }
}
