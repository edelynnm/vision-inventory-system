import express from "express";
import bodyParser from "body-parser";
import pool from "./db.js";
import signUp from "./signUp.js";
import login from "./login.js";

const app = express();

pool.connect((error, pgClient) => {
  if (error) {
    console.log("ERROR: Cannot connect to Postgres.");
    process.exit(1);
  }

  app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static("public"))

  // AUTHENTICATION
  // business owner login

    .post("/login", (req, res) => {
      login(pgClient, req, res);
    })

  // business owner sign up
    .post("/signUp", (req, res) => {
      signUp(pgClient, res, req);
    })

    .listen(8000, () => {
      console.log("Server has started: http://localhost:8000");
    });
});
