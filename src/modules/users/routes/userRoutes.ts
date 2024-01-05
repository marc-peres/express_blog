import { Request, Response, Router } from 'express';
import { postUserValidation, queryUsersValidator } from '../validators/usersValidators';
import { HTTP_STATUSES, RequestWithBodyType, RequestWithParamsType } from '../../../common/models';
import { InputPostUsersType, InputUsersWithQueryType, UserIdParamType } from '../models/input';
import { UserQueryRepository } from '../repositories/userQueryRepository';
import { UserService } from '../service/userService';
import { ObjectId } from 'mongodb';

export const userRoute = Router({});

userRoute.get('/', queryUsersValidator(), async (req: RequestWithBodyType<InputUsersWithQueryType>, res: Response) => {
  const sortData: InputUsersWithQueryType = {
    sortBy: req.body.sortBy,
    sortDirection: req.body.sortDirection,
    pageSize: req.body.pageSize,
    pageNumber: req.body.pageNumber,
    searchEmailTerm: req.body.searchEmailTerm,
    searchLoginTerm: req.body.searchLoginTerm,
  };

  const users = await UserQueryRepository.getAllUsers(sortData);
  res.send(users);
});

userRoute.post('/', postUserValidation(), async (req: RequestWithBodyType<InputPostUsersType>, res: Response) => {
  const { login, password, email } = req.body;
  const user = await UserService.createUser({ login, password, email });
  res.status(HTTP_STATUSES.CREATED_201).send(user);
});
userRoute.delete('/all-users', queryUsersValidator(), async (req: Request, res: Response) => {
  const result = await UserService.deleteAllUser();
  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

userRoute.delete('/:id', queryUsersValidator(), async (req: RequestWithParamsType<UserIdParamType>, res: Response) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const result = await UserService.deleteUserById(id);
  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});
