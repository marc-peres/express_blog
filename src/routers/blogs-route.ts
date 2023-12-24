import { Request, Response, Router } from 'express';
import { PostRequestByIdType, HTTP_STATUSES, CreateRequestType, PutRequestType } from '../models/common';
import { blogPostValidation } from '../validators';
import { BlogRepository } from '../repositories';
import { authValidation } from '../middlewares/auth/auth-validation';
import { BlogIdParamType, CreateBlogType } from '../models/blogs/input';
import { ObjectId } from 'mongodb';

export const blogRoute = Router({});

blogRoute.get('/', async (req: Request, res: Response) => {
  const allVideos = await BlogRepository.getAllBlogs();
  res.send(allVideos);
});

blogRoute.post('/', blogPostValidation(), async (req: CreateRequestType<CreateBlogType>, res: Response) => {
  const { name, websiteUrl, description } = req.body;
  const newVideo = await BlogRepository.createNewBlog({ name, websiteUrl, description });
  res.status(HTTP_STATUSES.CREATED_201).send(newVideo);
});

blogRoute.get('/:id', async (req: PostRequestByIdType<BlogIdParamType>, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

  const requestedBlog = await BlogRepository.findBlogById(id);
  if (!requestedBlog) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.send(requestedBlog);
});

blogRoute.put('/:id', blogPostValidation(), async (req: PutRequestType<BlogIdParamType, CreateBlogType>, res: Response) => {
  const { name, websiteUrl, description } = req.body;
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

  const result = await BlogRepository.updateBlog({ name, websiteUrl, description }, id);
  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

blogRoute.delete('/all-blogs', async (req: Request, res: Response) => {
  const result = await BlogRepository.deleteAllBlogs();
  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

blogRoute.delete('/:id', authValidation, async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  const result = await BlogRepository.deleteBlogById(id);

  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});
