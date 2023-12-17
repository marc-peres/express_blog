import { Request, Response, Router } from 'express';
import { PostRequestByIdType, HTTP_STATUSES, CreateRequestType, PutRequestType } from '../models/common';
import { BlogRepository } from '../repositories';
import { authValidation } from '../middlewares/auth/auth-validation';
import { BlogIdParamType } from '../models/blogs/input';
import { PostRepository } from '../repositories/post-repository';
import { createPostValidation } from '../validators/posts-validator';
import { CreatePostType } from '../models/posts/input';
import { BlogItemType } from '../models/blogs/output';

export const postsRoute = Router({});

postsRoute.get('/', (req: Request, res: Response) => {
  const allPosts = PostRepository.getAllPosts();
  res.send(allPosts);
});
postsRoute.post('/', createPostValidation(), (req: CreateRequestType<CreatePostType>, res: Response) => {
  const body = req.body;
  const currentBlog = BlogRepository.findBlogById(body.blogId);
  if (!currentBlog) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  const newVideo = PostRepository.createNewPost(body, currentBlog as BlogItemType);
  res.status(HTTP_STATUSES.CREATED_201).send(newVideo);
});

postsRoute.get('/:id', (req: PostRequestByIdType<BlogIdParamType>, res: Response) => {
  const id = req.params.id;
  const requestedPost = PostRepository.findPostById(id);
  if (!requestedPost) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.send(requestedPost);
});

postsRoute.put('/:id', createPostValidation(), (req: PutRequestType<BlogIdParamType, CreatePostType>, res: Response) => {
  const result = PostRepository.changePost(req);
  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

postsRoute.delete('/:id', authValidation, (req: Request, res: Response) => {
  const id = req.params.id;
  const requestedPost = PostRepository.findPostById(id);
  if (!requestedPost) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  PostRepository.deletePostById(id);
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

postsRoute.delete('/all-posts', authValidation, (req: Request, res: Response) => {
  PostRepository.deleteAllPosts();
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
