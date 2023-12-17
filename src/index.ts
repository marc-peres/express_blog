import { videoRoute } from './routers/videos-route';
import express from 'express';
import dotenv from 'dotenv';
import { blogRoute } from './routers/blogs-route';
import { postsRoute } from './routers/post-route';
import { testingRoute } from './routers/testing-rote';
import { homeRoute } from './routers/home-rote';

dotenv.config();
const port = process.env.PORT || 3000;
export const app = express();

app.use(express.json());

app.use('/', homeRoute);
app.use('/videos', videoRoute);
app.use('/blogs', blogRoute);
app.use('/posts', postsRoute);
app.use('/testing', testingRoute);

app.listen(port, () => {
  console.log(`App start on port ${port}`);
});
