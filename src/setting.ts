import express from 'express';
import { homeRoute } from './modules/home';
import { blogRoute } from './modules/blogs';
import { postsRoute } from './modules/posts';
import { testingRoute } from './modules/testing';

export const app = express();

app.use(express.json());

app.use('/', homeRoute);
app.use('/blogs', blogRoute);
app.use('/posts', postsRoute);
app.use('/testing', testingRoute);
