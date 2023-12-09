"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
const AvailableResolutionsType = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
let videosDb = [
    {
        id: 0,
        title: "string",
        author: "string",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: "2023-12-08T14:00:56.884Z",
        publicationDate: "2023-12-08T14:00:56.884Z",
        availableResolutions: [
            "P144", 'P240'
        ]
    }
];
exports.app.get('/', (req, res) => {
    res.send('home page');
});
exports.app.get('/videos', (req, res) => {
    res.send(videosDb);
});
exports.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const requestedVideo = videosDb.find(i => i.id === id);
    if (!requestedVideo) {
        res.sendStatus(404);
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
        availableResolutions.forEach(r => {
            if (!AvailableResolutionsType.includes(r)) {
                errors.errorsMessages[errors.errorsMessages.length] = {
                    message: 'invalid availableResolutions',
                    field: 'availableResolutions'
                };
            }
        });
    }
    else {
        availableResolutions = Array(AvailableResolutionsType[0]);
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors.errorsMessages);
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
    videosDb.push(newVideo);
    res.status(201).send(newVideo);
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
    const id = +req.params.id;
    let indexOfRequestedVideo = -1;
    const requestedVideo = videosDb.find((item, index) => {
        if (item.id === id) {
            indexOfRequestedVideo = index;
        }
        return item.id === id;
    });
    if (!requestedVideo) {
        res.sendStatus(404);
        return;
    }
    if (availableResolutions && Array.isArray(availableResolutions)) {
        availableResolutions.forEach(r => {
            if (!AvailableResolutionsType.includes(r)) {
                errors.errorsMessages[errors.errorsMessages.length] = {
                    message: 'invalid availableResolutions',
                    field: 'availableResolutions'
                };
            }
        });
    }
    else {
        availableResolutions = Array(AvailableResolutionsType[0]);
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors.errorsMessages);
        return;
    }
    const parsedDate = new Date(Date.parse(publicationDate));
    if (!publicationDate || !parsedDate || parsedDate.toISOString() !== publicationDate) {
        publicationDate = new Date().toISOString();
    }
    if (!minAgeRestriction || minAgeRestriction !== minAgeRestriction || typeof minAgeRestriction !== "number" || minAgeRestriction < 1 || minAgeRestriction > 18) {
        minAgeRestriction = null;
    }
    if (typeof canBeDownloaded !== 'boolean') {
        canBeDownloaded = false;
    }
    videosDb[indexOfRequestedVideo].title = title;
    videosDb[indexOfRequestedVideo].author = author;
    videosDb[indexOfRequestedVideo].availableResolutions = availableResolutions;
    videosDb[indexOfRequestedVideo].publicationDate = publicationDate;
    videosDb[indexOfRequestedVideo].canBeDownloaded = canBeDownloaded;
    res.sendStatus(204);
});
exports.app.delete('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const requestedVideo = videosDb.find(i => i.id === id);
    if (!requestedVideo) {
        res.sendStatus(404);
        return;
    }
    videosDb = videosDb.filter(i => i.id !== requestedVideo.id);
    res.sendStatus(204);
});
