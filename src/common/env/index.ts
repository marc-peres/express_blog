import dotenv from 'dotenv';

dotenv.config();
export const envVariables = {
  PORT: process.env.PORT,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  BASIC_AUTH_LOGIN: process.env.AUTH_LOGIN,
  BASIC_AUTH_PASSWORD: process.env.AUTH_PASSWORD,
  MONGO_LOCAL_DB_URI: process.env.MONGO_LOCAL_URI || 'mongodb://localhost:27017',
  MONGO_DEV_DB_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
};
