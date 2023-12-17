import { db } from '../db/db';

export class TestingRepository {
  static deleteAllVideos(): boolean {
    db.videos = [];
    db.blogs = [];
    db.posts = [];
    return true;
  }
}
