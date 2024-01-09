import express from 'express';
import { homeRoute } from './modules/home';
import { blogRoute } from './modules/blogs';
import { postsRoute } from './modules/posts';
import { testingRoute } from './modules/testing';
import { userRoute } from './modules/users';
import { authRoute } from './modules/auth/routes/authRoutes';
import { commentsRoute } from './modules/comments/routes/commentsRoutes';

export const app = express();

app.use(express.json());

app.use('/', homeRoute);
app.use('/blogs', blogRoute);
app.use('/posts', postsRoute);
app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/comments', commentsRoute);
app.use('/testing', testingRoute);
