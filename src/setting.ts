import express from 'express';
import { homeRoute } from './routers/home-rote';
import { blogRoute } from './routers/blogs-route';
import { postsRoute } from './routers/post-route';
import { testingRoute } from './routers/testing-rote';

export const app = express();

app.use(express.json());

app.use('/', homeRoute);
app.use('/blogs', blogRoute);
app.use('/posts', postsRoute);
app.use('/testing', testingRoute);
