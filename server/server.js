const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, done) => {
  if (err) {
    console.error("Connection error", err.stack);
  } else {
    console.log("Connected to the database");
    client.query(
      `
      CREATE TABLE IF NOT EXISTS records (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        score INT
      )
    `,
      (err, res) => {
        done();
        if (err) {
          console.log(err.stack);
        } else {
          console.log('Table "records" is created');
        }
      }
    );
  }
});

app.post("/api/results", async (req, res) => {
  const { name, score } = req.body;
  const client = await pool.connect();
  try {
    const response = await client.query(
      "INSERT INTO records(name, score) VALUES($1, $2) RETURNING *",
      [name, score]
    );
    res.json(response.rows[0]);
  } finally {
    client.release();
  }
});

app.get("/api/results", async (req, res) => {
  const client = await pool.connect();
  try {
    const response = await client.query(
      "SELECT * FROM records ORDER BY score DESC LIMIT 10"
    );
    res.json(response.rows);
  } finally {
    client.release();
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
