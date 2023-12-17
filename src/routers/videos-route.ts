import { Request, Response, Router } from 'express';
import { PostRequestByIdType, HTTP_STATUSES, CreateRequestType, PutRequestType } from '../models/common';
import { PostVideItemType, PutVideoItemType, VideoIdParamType } from '../models/videos';
import { idValid, videoPostValidation, videoPutValidation } from '../validators';
import { VideosRepository } from '../repositories';
import { authValidation } from '../middlewares/auth/auth-validation';

export const videoRoute = Router({});

videoRoute.get('/', (req: Request, res: Response) => {
  const allVideos = VideosRepository.getAllVideos();
  res.send(allVideos);
});

videoRoute.get('/:id', idValid(), (req: PostRequestByIdType<VideoIdParamType>, res: Response) => {
  const id = +req.params.id;
  const requestedVideo = VideosRepository.findVideoById(id);
  if (!requestedVideo) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  res.send(requestedVideo);
});

videoRoute.post('/', videoPostValidation(), (req: CreateRequestType<PostVideItemType>, res: Response) => {
  const body = req.body;
  const newVideo = VideosRepository.createNewVideo(body);
  res.status(HTTP_STATUSES.CREATED_201).send(newVideo);
});

videoRoute.put('/:id', videoPutValidation(), (req: PutRequestType<VideoIdParamType, PutVideoItemType>, res: Response) => {
  const result = VideosRepository.changeVideo(req);
  result ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
});

videoRoute.delete('/:id', authValidation, idValid(), (req: Request, res: Response) => {
  const id = +req.params.id;
  const requestedVideo = VideosRepository.findVideoById(id);
  if (!requestedVideo) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }
  VideosRepository.deleteVideoById(id);
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
