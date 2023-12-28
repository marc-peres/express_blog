import { Request, Response, Router } from 'express';
import { PostRequestByIdType, HTTP_STATUSES, CreateRequestType, PutRequestType } from '../../../common/models';
import { authValidation } from '../../../middlewares/auth/auth-validation';
import { createPostValidation } from '../validators/posts-validator';
import { CreatePostType } from '../models/input';
import { ObjectId } from 'mongodb';
import { BlogIdParamType, BlogRepository } from '../../blogs';
import { PostRepository } from '../index';

export const postsRoute = Router({});

postsRoute.get('/', async (req: Request, res: Response) => {
  const allPosts = await PostRepository.getAllPosts();
  res.send(allPosts);
});
postsRoute.post('/', createPostValidation(), async (req: CreateRequestType<CreatePostType>, res: Response) => {
  const { blogId, content, shortDescription, title } = req.body;

  if (!ObjectId.isValid(blogId)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const currentBlog = await BlogRepository.findBlogById(blogId);
  if (!currentBlog) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  const newVideo = await PostRepository.createNewPost({ blogId, content, shortDescription, title }, currentBlog);
  res.status(HTTP_STATUSES.CREATED_201).send(newVideo);
});

postsRoute.get('/:id', async (req: PostRequestByIdType<BlogIdParamType>, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const requestedPost = await PostRepository.findPostById(id);
  if (!requestedPost) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.send(requestedPost);
});

postsRoute.put('/:id', createPostValidation(), async (req: PutRequestType<BlogIdParamType, CreatePostType>, res: Response) => {
  const { blogId, content, shortDescription, title } = req.body;
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const result = await PostRepository.changePost({ blogId, content, shortDescription, title }, id);
  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

postsRoute.delete('/:id', authValidation, async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const requestedPost = await PostRepository.findPostById(id);
  if (!requestedPost) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  await PostRepository.deletePostById(id);
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

postsRoute.delete('/all-posts', async (req: Request, res: Response) => {
  console.log('delete/all-posts');
  await PostRepository.deleteAllPosts();
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
