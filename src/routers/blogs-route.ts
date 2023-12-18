import { Request, Response, Router } from 'express';
import { PostRequestByIdType, HTTP_STATUSES, CreateRequestType, PutRequestType } from '../models/common';
import { blogPostValidation } from '../validators';
import { BlogRepository } from '../repositories';
import { authValidation } from '../middlewares/auth/auth-validation';
import { BlogIdParamType, CreateBlogType } from '../models/blogs/input';

export const blogRoute = Router({});

blogRoute.get('/', (req: Request, res: Response) => {
  const allVideos = BlogRepository.getAllBlogs();
  res.send(allVideos);
});
blogRoute.post('/', blogPostValidation(), (req: CreateRequestType<CreateBlogType>, res: Response) => {
  const { name, websiteUrl, description } = req.body;
  const newVideo = BlogRepository.createNewBlog({ name, websiteUrl, description });
  res.status(HTTP_STATUSES.CREATED_201).send(newVideo);
});

blogRoute.get('/:id', (req: PostRequestByIdType<BlogIdParamType>, res: Response) => {
  const id = req.params.id;
  const requestedBlog = BlogRepository.findBlogById(id);
  if (!requestedBlog) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.send(requestedBlog);
});

blogRoute.put('/:id', blogPostValidation(), (req: PutRequestType<BlogIdParamType, CreateBlogType>, res: Response) => {
  const { name, websiteUrl, description } = req.body;
  const result = BlogRepository.changeBlog({ name, websiteUrl, description }, req.params.id);
  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});
blogRoute.delete('/all-blogs', (req: Request, res: Response) => {
  BlogRepository.deleteAllBlogs();
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
blogRoute.delete('/:id', authValidation, (req: Request, res: Response) => {
  const id = req.params.id;
  const requestedBlog = BlogRepository.findBlogById(id);
  if (!requestedBlog) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  BlogRepository.deleteBlogById(id);
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
