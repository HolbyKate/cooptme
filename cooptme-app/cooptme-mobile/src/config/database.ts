import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cooptme",
  password: "",
  port: 5432,
});

export default pool;
