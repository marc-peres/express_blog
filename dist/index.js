"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const videos_route_1 = require("./routers/videos-route");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const blogs_route_1 = require("./routers/blogs-route");
dotenv_1.default.config();
const port = process.env.PORT || 3000;
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use('/videos', videos_route_1.videoRoute);
exports.app.use('/blogs', blogs_route_1.blogRoute);
exports.app.listen(port, () => {
    console.log(`App start on port ${port}`);
});
