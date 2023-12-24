import dotenv from 'dotenv';
import { app } from './setting';
import { runDb } from './db/db';

dotenv.config();
if (!process.env.PORT) {
  throw new Error(` ! process.env.PORT doesn't found`);
}
const port = process.env.PORT;

app.listen(port, async () => {
  await runDb();
});
