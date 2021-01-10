import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pool from "./db.js";
import auth from "./Routes/auth.js";
import inventory from "./Routes/inventory.js";
import employees from "./Routes/employees.js";
import authenticateToken from "./utils/authenticateToken.js";
import sales from "./Routes/sales.js";
import user from "./Routes/user.js";
import reports from "./Routes/reports.js";

const app = express();
const port = 8000;

pool.connect((error) => {
  if (error) {
    console.log("ERROR: Cannot connect to Postgres.");
    process.exit(1);
  }
});

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.static("public"))
  .use(cors())
  .use("/api/auth", auth)
  .use(authenticateToken)
  .use("/api/user", user)
  .use("/api/inventory", inventory)
  .use("/api/sales", sales)
  .use("/api/report", reports)
  .use("/api/employees", employees)
  .listen(port, () => {
    console.log("Server has started: http://localhost:8000");
  });
