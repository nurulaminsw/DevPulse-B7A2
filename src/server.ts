import app from "./app";
import config from "./config";
import { initeDB } from "./db";

const main = () => {
  initeDB();
  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
};

main();
