const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client.connect();

app.post("/api/results", async (req, res) => {
  const { name, score } = req.body;
  const response = await client.query(
    "INSERT INTO records(name, score) VALUES($1, $2) RETURNING *",
    [name, score]
  );
  res.json(response.rows[0]);
});

app.get("/api/results", async (req, res) => {
  const response = await client.query(
    "SELECT * FROM records ORDER BY score DESC LIMIT 10"
  );
  res.json(response.rows);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
