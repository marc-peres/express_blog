import { Request, Response, Router } from 'express';
import {
  RequestWithParamsType,
  HTTP_STATUSES,
  RequestWithBodyType,
  RequestWithParamsAndBodyType,
  RequestWithQueryType,
} from '../../../common/models';
import { basicAuthMiddleware } from '../../../middlewares/auth/basicAuthMiddleware';
import { createPostValidation } from '../validators/postsValidator';
import { InputCreatePostType, InputPostQueryType } from '../models/input';
import { ObjectId } from 'mongodb';
import { BlogIdParamType } from '../../blogs';
import { PostService } from '../service/postService';
import { PostQueryRepository } from '../repositories/postQueryRepository';
import { BlogQueryRepository } from '../../blogs/repositories/blogQueryRepository';
import { RequestWithParamsAndQueryType } from '../../../common/models/comon';
import { InputCommentsWithQueryType, InputCreateCommentType, PutCommentInputType } from '../../comments/models/input';
import { CommentsQueryRepository } from '../../comments/repository/commentsQueryRepository';
import { bearerAuthMiddleware } from '../../../middlewares/auth/bearerAuthMiddleware';
import { putCommentValidation } from '../../comments/validators/commentValidators';
import { CommentService } from '../../comments/service/commentService';

export const postsRoute = Router({});

postsRoute.get('/', async (req: RequestWithQueryType<InputPostQueryType>, res: Response) => {
  const sortData: InputPostQueryType = {
    sortBy: req.query.sortBy,
    sortDirection: req.query.sortDirection,
    pageSize: req.query.pageSize,
    pageNumber: req.query.pageNumber,
  };
  const allPosts = await PostQueryRepository.getAllPosts(sortData);
  res.send(allPosts);
});

postsRoute.get('/:id', async (req: RequestWithParamsType<BlogIdParamType>, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const requestedPost = await PostQueryRepository.findPostById(id);
  if (!requestedPost) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.send(requestedPost);
});

postsRoute.get('/:id/comments', async (req: RequestWithParamsAndQueryType<BlogIdParamType, InputCommentsWithQueryType>, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const requestedPost = await PostQueryRepository.findPostById(id);
  if (!requestedPost) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

  const sortData: InputCommentsWithQueryType = {
    postId: id,
    pageNumber: req.query.pageNumber,
    pageSize: req.query.pageSize,
    sortBy: req.query.sortBy,
    sortDirection: req.query.sortDirection,
  };

  const commentsByPostId = await CommentsQueryRepository.getAllComment(sortData);

  res.send(commentsByPostId);
});

postsRoute.post(
  '/:id/comments',
  bearerAuthMiddleware,
  putCommentValidation(),
  async (req: RequestWithParamsAndBodyType<BlogIdParamType, PutCommentInputType>, res: Response) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    const requestedPost = await PostQueryRepository.findPostById(id);
    if (!requestedPost) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    const { _id, login } = req.user!;
    const { content } = req.body;

    const commentData: InputCreateCommentType = {
      content,
      postId: id,
      commentatorInfo: {
        userId: _id.toString(),
        userLogin: login,
      },
    };

    const commentsByPostId = await CommentService.createCommentByPostId(commentData);

    res.status(HTTP_STATUSES.CREATED_201).send(commentsByPostId);
  },
);

postsRoute.post('/', createPostValidation(), async (req: RequestWithBodyType<InputCreatePostType>, res: Response) => {
  const { blogId, content, shortDescription, title } = req.body;

  if (!ObjectId.isValid(blogId)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const currentBlog = await BlogQueryRepository.findBlogById(blogId);
  if (!currentBlog) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  const newPost = await PostService.createNewPost({ blogId, content, shortDescription, title }, currentBlog.name);
  res.status(HTTP_STATUSES.CREATED_201).send(newPost);
});

postsRoute.put(
  '/:id',
  createPostValidation(),
  async (req: RequestWithParamsAndBodyType<BlogIdParamType, InputCreatePostType>, res: Response) => {
    const { blogId, content, shortDescription, title } = req.body;
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    const result = await PostService.changePost({ blogId, content, shortDescription, title }, id);
    result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  },
);

postsRoute.delete('/:id', basicAuthMiddleware, async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const requestedPost = await PostQueryRepository.findPostById(id);
  if (!requestedPost) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  await PostService.deletePostById(id);
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

postsRoute.delete('/all-posts', async (req: Request, res: Response) => {
  await PostService.deleteAllPosts();
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
