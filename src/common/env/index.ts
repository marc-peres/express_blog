import dotenv from 'dotenv';

dotenv.config();
export const envVariables = {
  port: process.env.PORT,
  basicAuthLogin: process.env.AUTH_LOGIN,
  basicAuthPassword: process.env.AUTH_PASSWORD,
  mongoLocalDbUri: process.env.MONGO_LOCAL_URI || 'mongodb://localhost:27017',
  mongoDevDbUri: process.env.MONGO_URI || 'mongodb://localhost:27017',
};
