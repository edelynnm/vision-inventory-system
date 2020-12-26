import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pool from "./db.js";
import auth from "./Routes/auth.js";
import inventory from "./Routes/inventory.js";
import employees from "./Routes/employees.js";
import authenticateToken from "./utils/authenticateToken.js";
import sales from "./Routes/sales.js";

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
  .use("/api/inventory", inventory)
  .use("/api/sales", sales)
  .use("/api/manage-employees", employees)

  .listen(port, () => {
    console.log("Server has started: http://localhost:8000");
  });

// AUTHENTICATION
// admin owner login

// .post("/api/login", (req, res) => {
//   login(pgClient, req, res);
// })

// // admin owner sign up
// .post("/api/sign-up", async (req, res) => {
//   signUp(pgClient, res, req);
// })

// // verify signUp
// .post("/api/sign-up/verify-email", (req, res) => {
//   verifyEmail(pgClient, req, res);
// })

// // employee sign up by admin
// .post("/api/manage-emp/reg", (req, res) => {
//   registerEmployee(pgClient, req, res);
// })

// .post("/api/sign-up/forgot-password", (req, res) => {
//   verifyEmail(pgClient, req, res);
//   const { token } = req.query;

//   pgClient.query("SELECT user_id, verification_token FROM users WHERE verification_token = $1", [token], (pgError, { rows }) => {
//     if (pgError) {
//       console.log(pgError);
//       res.send(500).json({ pgError });
//     } else if (rows[0] === undefined) {
//       res.send(400).json({ sucess: false, message: "ERROR: Bad request" });
//     } else {
//       res.json(rows[0]);
//     }
//   });
// })
// // emp setup account
// .post("/api/sign-up/emp/forgot-password", (req, res) => {
//   verifyEmail(pgClient, req, res);

//   const { newPassword } = req.body;

//   bcrypt.hash(newPassword, 13, (bcryptErr, hashedPassword) => {
//     if (bcryptErr) {
//       console.log(bcryptErr);
//       res.send(500);
//     } else {
//       pgClient.query("UPDATE user SET password = $1 WHERE user_id = $2",
//         [hashedPassword, req.query.id],
//         (pgError) => {
//           if (pgError) {
//             console.log(pgError);
//             res.send(500);
//           } else {
//             res.json({ success: true, message: "Password changed successfully!" });
//           }
//         });
//     }
//   });
// })
