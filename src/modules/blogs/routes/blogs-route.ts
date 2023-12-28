import { Request, Response, Router } from 'express';
import {
  RequestWithParamsType,
  HTTP_STATUSES,
  RequestWithBodyType,
  RequestWithParamsAndBodyType,
  RequestWithQueryType,
} from '../../../common/models';
import { authValidation } from '../../../middlewares/auth/auth-validation';
import { BlogIdParamType, InputBlogWithQueryType, InputCreateBlogType } from '../models/input';
import { ObjectId } from 'mongodb';
import { blogPostValidation } from '../validators/blog-validator';
import { BlogService } from '../service/blogService';

export const blogRoute = Router({});

blogRoute.get('/', async (req: RequestWithQueryType<InputBlogWithQueryType>, res: Response) => {
  const sortData: InputBlogWithQueryType = {
    searchNameTerm: req.query.searchNameTerm,
    sortBy: req.query.sortBy,
    sortDirection: req.query.sortDirection,
    pageNumber: req.query.pageNumber,
    pageSize: req.query.pageSize,
  };

  const allVideos = await BlogService.getAllBlogs(sortData);
  res.send(allVideos);
});

blogRoute.get('/:id', async (req: RequestWithParamsType<BlogIdParamType>, res: Response) => {
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

blogRoute.post('/', blogPostValidation(), async (req: RequestWithBodyType<InputCreateBlogType>, res: Response) => {
  const { name, websiteUrl, description } = req.body;
  const newVideo = await BlogService.createNewBlog({ name, websiteUrl, description });
  res.status(HTTP_STATUSES.CREATED_201).send(newVideo);
});

blogRoute.put(
  '/:id',
  blogPostValidation(),
  async (req: RequestWithParamsAndBodyType<BlogIdParamType, InputCreateBlogType>, res: Response) => {
    const { name, websiteUrl, description } = req.body;
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    const result = await BlogService.updateBlog({ name, websiteUrl, description }, id);
    result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
  },
);

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
