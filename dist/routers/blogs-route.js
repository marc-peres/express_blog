"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoute = void 0;
const express_1 = require("express");
const common_1 = require("../models/common");
const validators_1 = require("../validators");
const repositories_1 = require("../repositories");
const auth_validation_1 = require("../middlewares/auth/auth-validation");
exports.blogRoute = (0, express_1.Router)({});
exports.blogRoute.get('/', (req, res) => {
    const allVideos = repositories_1.BlogRepository.getAllBlogs();
    res.send(allVideos);
});
exports.blogRoute.post('/', (0, validators_1.blogPostValidation)(), (req, res) => {
    const body = req.body;
    const newVideo = repositories_1.BlogRepository.createNewBlog(body);
    res.status(common_1.HTTP_STATUSES.CREATED_201).send(newVideo);
});
exports.blogRoute.get('/:id', (0, validators_1.idValid)(), (req, res) => {
    const id = +req.params.id;
    const requestedBlog = repositories_1.BlogRepository.findBlogById(id);
    if (!requestedBlog) {
        res.sendStatus(common_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.send(requestedBlog);
});
exports.blogRoute.put('/:id', (0, validators_1.blogPostValidation)(), (req, res) => {
    const result = repositories_1.BlogRepository.changeBlog(req);
    console.log('result', result);
    result ? res.sendStatus(common_1.HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(common_1.HTTP_STATUSES.NOT_FOUND_404);
});
exports.blogRoute.delete('/:id', auth_validation_1.authValidation, (0, validators_1.idValid)(), (req, res) => {
    const id = +req.params.id;
    const requestedBlog = repositories_1.BlogRepository.findBlogById(id);
    if (!requestedBlog) {
        res.sendStatus(common_1.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    repositories_1.BlogRepository.deleteBlogById(id);
    res.sendStatus(common_1.HTTP_STATUSES.NO_CONTENT_204);
});
exports.blogRoute.delete('/all-blogs', auth_validation_1.authValidation, (req, res) => {
    console.log('all-blogs');
    repositories_1.BlogRepository.deleteAllBlogs();
    res.sendStatus(common_1.HTTP_STATUSES.NO_CONTENT_204);
});
