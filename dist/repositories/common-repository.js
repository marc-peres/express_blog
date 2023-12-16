"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonRepository = void 0;
const db_1 = require("../db/db");
class CommonRepository {
    static deleteAllData() {
        db_1.db.blogs = [];
        db_1.db.videos = [];
    }
}
exports.CommonRepository = CommonRepository;
