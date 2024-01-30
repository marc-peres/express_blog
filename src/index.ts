import { app } from './setting';
import { runDb } from './db/db';
import { envVariables } from './common/env';

const port = envVariables.PORT;

const start = async () => {
  try {
    app.listen(port, async () => {
      await runDb();
    });
  } catch (e) {
    console.log('START ERROR', e);
  }
};
start();
