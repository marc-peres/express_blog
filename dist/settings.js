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
const videosDb = [
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
        availableResolutions = Array(0);
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
