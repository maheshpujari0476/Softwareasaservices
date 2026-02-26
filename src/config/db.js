import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

// const dbUri = process.env.NODE_ENV === "test" ?process.env.PG_DATABASE_TEST:process.env.PG_DATABASE;

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
});



export { pool };
