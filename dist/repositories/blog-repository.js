"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = void 0;
const db_1 = require("../db/db");
class BlogRepository {
    static getAllBlogs() {
        return db_1.db.blogs;
    }
    static findBlogById(id) {
        return db_1.db.blogs.find(i => i.id === id);
    }
    static createNewBlog(body) {
        const { name, websiteUrl, description } = body;
        const id = +new Date();
        const newBlog = {
            id,
            name,
            websiteUrl,
            description,
        };
        db_1.db.blogs.push(newBlog);
        return newBlog;
    }
    static changeBlog(req) {
        const { name, websiteUrl, description } = req.body;
        const id = +req.params.id;
        let indexOfRequestedBlog = -1;
        const requestedBlog = db_1.db.blogs.find((item, index) => {
            if (item.id === id) {
                indexOfRequestedBlog = index;
            }
            return item.id === id;
        });
        if (!requestedBlog) {
            return false;
        }
        db_1.db.blogs[indexOfRequestedBlog].name = name;
        db_1.db.blogs[indexOfRequestedBlog].websiteUrl = websiteUrl;
        db_1.db.blogs[indexOfRequestedBlog].description = description;
        return true;
    }
    static deleteBlogById(id) {
        db_1.db.blogs = db_1.db.blogs.filter(i => i.id !== id);
    }
    static deleteAllBlogs() {
        db_1.db.blogs = [];
        return !db_1.db.blogs.length;
    }
}
exports.BlogRepository = BlogRepository;
