"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUSES = exports.videosDb = exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
const AvailableResolutionsType = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
exports.videosDb = [];
exports.HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};
exports.app.get('/', (req, res) => {
    res.send('home page');
});
exports.app.get('/videos', (req, res) => {
    res.send(exports.videosDb);
});
exports.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const requestedVideo = exports.videosDb.find(i => i.id === id);
    if (!requestedVideo) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.send(requestedVideo);
});
exports.app.post('/videos', (req, res) => {
    let { title, author, availableResolutions } = req.body;
    const errors = {
        errorsMessages: Array(0),
    };
    if (!title || typeof title !== "string" || !title.trim() || title.length > 40) {
        errors.errorsMessages[errors.errorsMessages.length] = {
            message: 'invalid title',
            field: 'title'
        };
    }
    if (!author || typeof author !== "string" || !author.trim() || author.length > 20) {
        errors.errorsMessages[errors.errorsMessages.length] = {
            message: 'invalid author',
            field: 'author'
        };
    }
    if (availableResolutions && Array.isArray(availableResolutions)) {
        for (let i = 0; i < availableResolutions.length; i++) {
            if (!AvailableResolutionsType.includes(availableResolutions[i])) {
                errors.errorsMessages[errors.errorsMessages.length] = {
                    message: 'invalid availableResolutions',
                    field: 'availableResolutions'
                };
                break;
            }
        }
    }
    else {
        availableResolutions = Array(AvailableResolutionsType[0]);
    }
    if (errors.errorsMessages.length) {
        res.status(exports.HTTP_STATUSES.BAD_REQUEST_400).send(errors);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
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
    exports.videosDb.push(newVideo);
    res.status(exports.HTTP_STATUSES.CREATED_201).send(newVideo);
});
exports.app.put('/videos/:id', (req, res) => {
    let { title, author, availableResolutions, publicationDate, minAgeRestriction, canBeDownloaded } = req.body;
    const errors = {
        errorsMessages: Array(0),
    };
    if (!title || typeof title !== "string" || !title.trim() || title.length > 40) {
        errors.errorsMessages[errors.errorsMessages.length] = {
            message: 'invalid title',
            field: 'title'
        };
    }
    if (!author || typeof author !== "string" || !author.trim() || author.length > 20) {
        errors.errorsMessages[errors.errorsMessages.length] = {
            message: 'invalid author',
            field: 'author'
        };
    }
    if (availableResolutions && Array.isArray(availableResolutions)) {
        for (let i = 0; i < availableResolutions.length; i++) {
            if (!AvailableResolutionsType.includes(availableResolutions[i])) {
                errors.errorsMessages[errors.errorsMessages.length] = {
                    message: 'invalid availableResolutions',
                    field: 'availableResolutions'
                };
                break;
            }
        }
    }
    else {
        availableResolutions = Array(AvailableResolutionsType[0]);
    }
    if (typeof canBeDownloaded !== 'boolean' && canBeDownloaded !== undefined) {
        errors.errorsMessages[errors.errorsMessages.length] = {
            message: 'invalid canBeDownloaded',
            field: 'canBeDownloaded'
        };
    }
    if (errors.errorsMessages.length) {
        res.status(exports.HTTP_STATUSES.BAD_REQUEST_400).send(errors);
        return;
    }
    const id = +req.params.id;
    let indexOfRequestedVideo = -1;
    const requestedVideo = exports.videosDb.find((item, index) => {
        if (item.id === id) {
            indexOfRequestedVideo = index;
        }
        return item.id === id;
    });
    if (!requestedVideo) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    const parsedDate = new Date(Date.parse(publicationDate));
    if (!publicationDate || !parsedDate || parsedDate.toISOString() !== publicationDate) {
        publicationDate = new Date().toISOString();
    }
    if (!minAgeRestriction || minAgeRestriction !== minAgeRestriction || typeof minAgeRestriction !== "number" || minAgeRestriction < 1 || minAgeRestriction > 18) {
        minAgeRestriction = null;
    }
    exports.videosDb[indexOfRequestedVideo].title = title;
    exports.videosDb[indexOfRequestedVideo].author = author;
    exports.videosDb[indexOfRequestedVideo].availableResolutions = availableResolutions;
    exports.videosDb[indexOfRequestedVideo].publicationDate = publicationDate;
    exports.videosDb[indexOfRequestedVideo].canBeDownloaded = canBeDownloaded;
    exports.videosDb[indexOfRequestedVideo].minAgeRestriction = minAgeRestriction;
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.delete('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const requestedVideo = exports.videosDb.find(i => i.id === id);
    if (!requestedVideo) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    exports.videosDb = exports.videosDb.filter(i => i.id !== requestedVideo.id);
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.delete('/__test__/all-data', (req, res) => {
    exports.videosDb = [];
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
