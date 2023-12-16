"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRoute = void 0;
const express_1 = require("express");
const common_1 = require("../models/common");
const validators_1 = require("../validators");
const repositories_1 = require("../repositories");
const auth_validation_1 = require("../middlewares/auth/auth-validation");
exports.videoRoute = (0, express_1.Router)({});
exports.videoRoute.get('/', (req, res) => {
    const allVideos = repositories_1.VideosRepository.getAllVideos();
    res.send(allVideos);
});
exports.videoRoute.get('/:id', (0, validators_1.idValid)(), (req, res) => {
    const id = +req.params.id;
    const requestedVideo = repositories_1.VideosRepository.findVideoById(id);
    if (!requestedVideo) {
        res.sendStatus(common_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.send(requestedVideo);
});
exports.videoRoute.post('/', (0, validators_1.videoPostValidation)(), (req, res) => {
    const body = req.body;
    const newVideo = repositories_1.VideosRepository.createNewVideo(body);
    res.status(common_1.HTTP_STATUSES.CREATED_201).send(newVideo);
});
exports.videoRoute.put('/:id', (0, validators_1.videoPutValidation)(), (req, res) => {
    const result = repositories_1.VideosRepository.changeVideo(req);
    result ? res.sendStatus(common_1.HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(common_1.HTTP_STATUSES.NOT_FOUND_404);
});
exports.videoRoute.delete('/:id', auth_validation_1.authValidation, (0, validators_1.idValid)(), (req, res) => {
    const id = +req.params.id;
    const requestedVideo = repositories_1.VideosRepository.findVideoById(id);
    if (!requestedVideo) {
        res.sendStatus(common_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    repositories_1.VideosRepository.deleteVideoById(id);
    res.sendStatus(common_1.HTTP_STATUSES.NO_CONTENT_204);
});
exports.videoRoute.delete('/all-data', auth_validation_1.authValidation, (req, res) => {
    const result = repositories_1.VideosRepository.deleteAllVideos();
    result ? res.sendStatus(common_1.HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(common_1.HTTP_STATUSES.BAD_REQUEST_400);
});
