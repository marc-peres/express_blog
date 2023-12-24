import dotenv from 'dotenv';
import { app } from './setting';
import { runDb } from './db/db';

dotenv.config();
const port = process.env.PORT || 3000;

app.listen(port, async () => {
  await runDb();
});
