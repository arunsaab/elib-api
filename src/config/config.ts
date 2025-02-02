import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  mongo_connection_url: process.env.MONGO_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  cloudinaryCloud: process.env.CLOUDINARY_CLOUD,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
};

export const config = Object.freeze(_config);
