import { videoRoute } from './routers/videos-route';
import express from 'express';
import dotenv from 'dotenv';
import { blogRoute } from './routers/blogs-route';

dotenv.config();
const port = process.env.PORT || 3000;
export const app = express();

app.use(express.json());

app.use('/videos', videoRoute);
app.use('/blogs', blogRoute);

app.listen(port, () => {
  console.log(`App start on port ${port}`);
});
