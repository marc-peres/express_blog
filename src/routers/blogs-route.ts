import { Request, Response, Router } from 'express';
import { PostRequestByIdType, HTTP_STATUSES, CreateRequestType, PutRequestType } from '../models/common';
import { blogPostValidation, idValid } from '../validators';
import { BlogRepository } from '../repositories';
import { authValidation } from '../middlewares/auth/auth-validation';
import { BlogIdParamType, CreateBlogType } from '../models/blogs/input';

export const blogRoute = Router({});

blogRoute.get('/', (req: Request, res: Response) => {
  const allVideos = BlogRepository.getAllBlogs();
  res.send(allVideos);
});
blogRoute.post('/', blogPostValidation(), (req: CreateRequestType<CreateBlogType>, res: Response) => {
  const body = req.body;
  const newVideo = BlogRepository.createNewBlog(body);
  res.status(HTTP_STATUSES.CREATED_201).send(newVideo);
});

blogRoute.get('/:id', idValid(), (req: PostRequestByIdType<BlogIdParamType>, res: Response) => {
  const id = req.params.id;
  const requestedBlog = BlogRepository.findBlogById(id);
  if (!requestedBlog) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.send(requestedBlog);
});

blogRoute.put('/:id', blogPostValidation(), (req: PutRequestType<BlogIdParamType, CreateBlogType>, res: Response) => {
  const result = BlogRepository.changeBlog(req);
  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

blogRoute.delete('/:id', authValidation, idValid(), (req: Request, res: Response) => {
  const id = req.params.id;
  const requestedBlog = BlogRepository.findBlogById(id);
  if (!requestedBlog) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  BlogRepository.deleteBlogById(id);
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

blogRoute.delete('/all-blogs', authValidation, (req: Request, res: Response) => {
  BlogRepository.deleteAllBlogs();
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
