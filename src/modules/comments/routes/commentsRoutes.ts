import { Router, Response } from 'express';
import { ObjectId } from 'mongodb';
import { HTTP_STATUSES, RequestWithParamsAndBodyType, RequestWithParamsType } from '../../../common/models';
import { CommentsQueryRepository } from '../repository/commentsQueryRepository';
import { CommentIdParamType, PutCommentInputType } from '../models/input';
import { putCommentValidation } from '../validators/commentValidators';
import { bearerAuthMiddleware } from '../../../middlewares/auth/bearerAuthMiddleware';
import { CommentService } from '../service/commentService';

export const commentsRoute = Router({});

commentsRoute.get('/:id', async (req: RequestWithParamsType<CommentIdParamType>, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const requestedComment = await CommentsQueryRepository.getCommentById(id);
  if (!requestedComment) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.send(requestedComment);
});

commentsRoute.put(
  '/:id',
  bearerAuthMiddleware,
  putCommentValidation(),
  async (req: RequestWithParamsAndBodyType<CommentIdParamType, PutCommentInputType>, res: Response) => {
    const commentId = req.params.id;
    const userId = req.user!._id!;

    if (!ObjectId.isValid(commentId)) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }
    const requestedComment = await CommentsQueryRepository.getCommentById(commentId);

    if (!requestedComment) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    if (requestedComment?.commentatorInfo?.userId !== userId.toString()) {
      res.sendStatus(HTTP_STATUSES.ERROR_AUTHENTICATION_403);
      return;
    }

    const { content } = req.body;

    await CommentService.changeCommentById(commentId, content);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  },
);

commentsRoute.delete('/all-comments', bearerAuthMiddleware, async (req: RequestWithParamsType<CommentIdParamType>, res: Response) => {
  const deletedResult = await CommentService.deleteAllComment();
  deletedResult ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
});

commentsRoute.delete('/:id', bearerAuthMiddleware, async (req: RequestWithParamsType<CommentIdParamType>, res: Response) => {
  const commentId = req.params.id;
  const userId = req.user!._id!;

  if (!ObjectId.isValid(commentId)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }
  const requestedComment = await CommentsQueryRepository.getCommentById(commentId);

  if (!requestedComment) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

  if (requestedComment?.commentatorInfo?.userId !== userId.toString()) {
    res.sendStatus(HTTP_STATUSES.ERROR_AUTHENTICATION_403);
    return;
  }

  const deletedResult = await CommentService.deleteCommentById(commentId);

  deletedResult ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
});
