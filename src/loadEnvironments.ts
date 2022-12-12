import dotenv from "dotenv";

dotenv.config();

const environtment = {
  mongoDbUrl: process.env.MONGODB_URL,
  port: process.env.PORT,
  debugdb: process.env.DEBUG,
  corsAllowedDomain: process.env.CORS_ALLOWED_DOMAIN,
  secret: process.env.JWT_SECRET,
  salt: process.env.SALT,
};

export default environtment;
