"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const common_1 = require("../../models/common");
dotenv_1.default.config();
const authValidation = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        res.sendStatus(common_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const [basic, token] = auth.split(' ');
    if (basic !== 'Basic') {
        res.sendStatus(common_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    const decodeAuth = Buffer.from(token, 'base64').toString();
    const [login, password] = decodeAuth.split(':');
    if (login !== process.env.AUTH_LOGIN || password !== process.env.AUTH_PASSWORD) {
        res.sendStatus(common_1.HTTP_STATUSES.UNAUTHORIZED_401);
        return;
    }
    next();
};
exports.authValidation = authValidation;
