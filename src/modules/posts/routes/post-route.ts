import { Request, Response, Router } from 'express';
import { PostRequestByIdType, HTTP_STATUSES, CreateRequestType, PutRequestType } from '../../../common/models';
import { authValidation } from '../../../middlewares/auth/auth-validation';
import { createPostValidation } from '../validators/posts-validator';
import { InputCreatePostType } from '../models/input';
import { ObjectId } from 'mongodb';
import { BlogIdParamType, BlogService } from '../../blogs';
import { PostService } from '../service/postService';

export const postsRoute = Router({});

postsRoute.get('/', async (req: Request, res: Response) => {
  const allPosts = await PostService.getAllPosts();
  res.send(allPosts);
});

postsRoute.get('/:id', async (req: PostRequestByIdType<BlogIdParamType>, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const requestedPost = await PostService.findPostById(id);
  if (!requestedPost) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.send(requestedPost);
});

postsRoute.post('/', createPostValidation(), async (req: CreateRequestType<InputCreatePostType>, res: Response) => {
  const { blogId, content, shortDescription, title } = req.body;

  if (!ObjectId.isValid(blogId)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const currentBlog = await BlogService.findBlogById(blogId);
  if (!currentBlog) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  const newVideo = await PostService.createNewPost({ blogId, content, shortDescription, title }, currentBlog);
  res.status(HTTP_STATUSES.CREATED_201).send(newVideo);
});

postsRoute.put('/:id', createPostValidation(), async (req: PutRequestType<BlogIdParamType, InputCreatePostType>, res: Response) => {
  const { blogId, content, shortDescription, title } = req.body;
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const result = await PostService.changePost({ blogId, content, shortDescription, title }, id);
  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

postsRoute.delete('/:id', authValidation, async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const requestedPost = await PostService.findPostById(id);
  if (!requestedPost) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  await PostService.deletePostById(id);
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

postsRoute.delete('/all-posts', async (req: Request, res: Response) => {
  console.log('delete/all-posts');
  await PostService.deleteAllPosts();
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});