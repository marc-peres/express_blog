"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosRepository = void 0;
const db_1 = require("../db/db");
const videos_1 = require("../models/videos");
class VideosRepository {
    static getAllVideos() {
        return db_1.db.videos;
    }
    static deleteAllVideos() {
        db_1.db.videos = [];
        return true;
    }
    static findVideoById(id) {
        return db_1.db.videos.find(i => i.id === id);
    }
    static createNewVideo(body) {
        let { title, author, availableResolutions } = body;
        if (!availableResolutions || (Array.isArray(availableResolutions) && !availableResolutions.length)) {
            availableResolutions = Array(videos_1.AvailableResolutionsType.P240);
        }
        const createdAt = new Date();
        let publicationDate = new Date();
        publicationDate = new Date(publicationDate.setDate(new Date().getDate() + 1));
        const newVideo = {
            id: +createdAt,
            createdAt: createdAt.toISOString(),
            publicationDate: publicationDate.toISOString(),
            author,
            title,
            minAgeRestriction: null,
            canBeDownloaded: false,
            availableResolutions,
        };
        db_1.db.videos.push(newVideo);
        return newVideo;
    }
    static changeVideo(req) {
        let { title, author, availableResolutions, publicationDate, minAgeRestriction, canBeDownloaded } = req.body;
        const id = +req.params.id;
        let indexOfRequestedVideo = -1;
        const requestedVideo = db_1.db.videos.find((item, index) => {
            if (item.id === id) {
                indexOfRequestedVideo = index;
            }
            return item.id === id;
        });
        if (!requestedVideo) {
            return false;
        }
        db_1.db.videos[indexOfRequestedVideo].title = title;
        db_1.db.videos[indexOfRequestedVideo].author = author;
        db_1.db.videos[indexOfRequestedVideo].availableResolutions = availableResolutions;
        db_1.db.videos[indexOfRequestedVideo].publicationDate = publicationDate || db_1.db.videos[indexOfRequestedVideo].publicationDate;
        db_1.db.videos[indexOfRequestedVideo].canBeDownloaded = canBeDownloaded;
        db_1.db.videos[indexOfRequestedVideo].minAgeRestriction = minAgeRestriction || null;
        return true;
    }
    static deleteVideoById(id) {
        db_1.db.videos = db_1.db.videos.filter(i => i.id !== id);
    }
}
exports.VideosRepository = VideosRepository;
