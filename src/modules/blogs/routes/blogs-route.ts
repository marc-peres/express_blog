import { Request, Response, Router } from 'express';
import { PostRequestByIdType, HTTP_STATUSES, CreateRequestType, PutRequestType } from '../../../common/models';
import { authValidation } from '../../../middlewares/auth/auth-validation';
import { BlogIdParamType, InputCreateBlogType } from '../models/input';
import { ObjectId } from 'mongodb';
import { blogPostValidation } from '../validators/blog-validator';
import { BlogService } from '../service/blogService';

export const blogRoute = Router({});

blogRoute.get('/', async (req: Request, res: Response) => {
  const allVideos = await BlogService.getAllBlogs();
  res.send(allVideos);
});

blogRoute.get('/:id', async (req: PostRequestByIdType<BlogIdParamType>, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

  const requestedBlog = await BlogService.findBlogById(id);
  if (!requestedBlog) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.send(requestedBlog);
});

blogRoute.post('/', blogPostValidation(), async (req: CreateRequestType<InputCreateBlogType>, res: Response) => {
  const { name, websiteUrl, description } = req.body;
  const newVideo = await BlogService.createNewBlog({ name, websiteUrl, description });
  res.status(HTTP_STATUSES.CREATED_201).send(newVideo);
});

blogRoute.put('/:id', blogPostValidation(), async (req: PutRequestType<BlogIdParamType, InputCreateBlogType>, res: Response) => {
  const { name, websiteUrl, description } = req.body;
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

  const result = await BlogService.updateBlog({ name, websiteUrl, description }, id);
  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

blogRoute.delete('/all-blogs', async (req: Request, res: Response) => {
  const result = await BlogService.deleteAllBlogs();
  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

blogRoute.delete('/:id', authValidation, async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  const result = await BlogService.deleteBlogById(id);

  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});
