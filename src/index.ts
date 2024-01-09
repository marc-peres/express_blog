import { app } from './setting';
import { runDb } from './db/db';
import { envVariables } from './common/env';

const port = envVariables.PORT;

app.listen(port, async () => {
  await runDb();
});
