import { Request, Response, Router } from 'express';
import {
  RequestWithParamsType,
  HTTP_STATUSES,
  RequestWithBodyType,
  RequestWithParamsAndBodyType,
  RequestWithQueryType,
} from '../../../common/models';
import { authValidation } from '../../../middlewares/auth/authValidation';
import { BlogIdParamType, InputBlogWithQueryType, InputCreateBlogType, InputCreatePostByBlogIdType } from '../models/input';
import { ObjectId } from 'mongodb';
import { blogPostValidation, CreatePostByBlogIdValidation } from '../validators/blogValidator';
import { BlogService } from '../service/blogService';
import { RequestWithParamsAndQueryType } from '../../../common/models/comon';
import { PostService } from '../../posts/service/postService';
import { BlogQueryRepository } from '../repositories/blogQueryRepository';
import { PostQueryRepository } from '../../posts/repositories/postQueryRepository';

export const blogRoute = Router({});

blogRoute.get('/', async (req: RequestWithQueryType<InputBlogWithQueryType>, res: Response) => {
  const sortData: InputBlogWithQueryType = {
    searchNameTerm: req.query.searchNameTerm,
    sortBy: req.query.sortBy,
    sortDirection: req.query.sortDirection,
    pageNumber: req.query.pageNumber,
    pageSize: req.query.pageSize,
  };

  const allVideos = await BlogQueryRepository.getAllBlogs(sortData);
  res.send(allVideos);
});

blogRoute.get('/:id', async (req: RequestWithParamsType<BlogIdParamType>, res: Response) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const requestedBlog = await BlogQueryRepository.findBlogById(id);
  if (!requestedBlog) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.send(requestedBlog);
});

blogRoute.get('/:id/posts', async (req: RequestWithParamsAndQueryType<BlogIdParamType, InputBlogWithQueryType>, res: Response) => {
  const blogId = req.params.id;
  if (!ObjectId.isValid(blogId)) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }

  const sortData: InputBlogWithQueryType = {
    sortBy: req.query.sortBy,
    sortDirection: req.query.sortDirection,
    pageNumber: req.query.pageNumber,
    pageSize: req.query.pageSize,
    blogId,
  };

  const requestedBlog = await BlogQueryRepository.findBlogById(blogId);
  if (!requestedBlog) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }

  const allPostsByBlogId = await PostQueryRepository.getAllPosts(sortData);
  res.send(allPostsByBlogId);
});

blogRoute.post(
  '/:id/posts',
  CreatePostByBlogIdValidation(),
  async (req: RequestWithParamsAndBodyType<BlogIdParamType, InputCreatePostByBlogIdType>, res: Response) => {
    const content = req.body.content;
    const title = req.body.title;
    const shortDescription = req.body.shortDescription;
    const blogId = req.params.id;

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
  },
);

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
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
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
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }
  const result = await BlogService.deleteBlogById(id);

  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});
