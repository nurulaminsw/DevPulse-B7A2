import dotenv from "dotenv";

import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  connection_string: process.env.CANNECTIONSTRING as string,
  port: process.env.PORT,
  secret:process.env.JWD_SECRET
};

export default config;
