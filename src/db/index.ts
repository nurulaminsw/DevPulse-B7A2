import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.connection_string,
});
export const initeDB = async () => {
  try {
    await pool.query(`
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(12) NOT NULL DEFAULT 'contributor'
    CHECK (role IN ('contributor', 'maintainer')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
`);

    console.log("database connected sucsessfully");
  } catch (error) {
    console.log(error);
  }
};
