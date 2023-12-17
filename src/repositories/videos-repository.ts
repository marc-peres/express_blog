import { db } from '../db/db';
import { AvailableResolutionsType, PostVideItemType, PutVideoItemType, VideoIdParamType, VideosDbType } from '../models/videos';
import { PutRequestType } from '../models/common';

export class VideosRepository {
  static getAllVideos(): VideosDbType[] {
    return db.videos;
  }

  static findVideoById(id: number): VideosDbType | undefined {
    return db.videos.find(i => i.id === id);
  }

  static createNewVideo(body: PostVideItemType): VideosDbType {
    let { title, author, availableResolutions } = body;

    if (!availableResolutions || (Array.isArray(availableResolutions) && !availableResolutions.length)) {
      availableResolutions = Array(AvailableResolutionsType.P240);
    }

    const createdAt = new Date();
    let publicationDate = new Date();
    publicationDate = new Date(publicationDate.setDate(new Date().getDate() + 1));

    const newVideo: VideosDbType = {
      id: +createdAt,
      createdAt: createdAt.toISOString(),
      publicationDate: publicationDate.toISOString(),
      author,
      title,
      minAgeRestriction: null,
      canBeDownloaded: false,
      availableResolutions,
    };

    db.videos.push(newVideo);

    return newVideo;
  }

  static changeVideo(req: PutRequestType<VideoIdParamType, PutVideoItemType>): boolean {
    let { title, author, availableResolutions, publicationDate, minAgeRestriction, canBeDownloaded } = req.body;

    const id = +req.params.id;

    let indexOfRequestedVideo = -1;
    const requestedVideo = db.videos.find((item, index) => {
      if (item.id === id) {
        indexOfRequestedVideo = index;
      }
      return item.id === id;
    });

    if (!requestedVideo) {
      return false;
    }

    db.videos[indexOfRequestedVideo].title = title;
    db.videos[indexOfRequestedVideo].author = author;
    db.videos[indexOfRequestedVideo].availableResolutions = availableResolutions;
    db.videos[indexOfRequestedVideo].publicationDate = publicationDate || db.videos[indexOfRequestedVideo].publicationDate;
    db.videos[indexOfRequestedVideo].canBeDownloaded = canBeDownloaded;
    db.videos[indexOfRequestedVideo].minAgeRestriction = minAgeRestriction || null;

    return true;
  }

  static deleteVideoById(id: number): void {
    db.videos = db.videos.filter(i => i.id !== id);
  }
}
