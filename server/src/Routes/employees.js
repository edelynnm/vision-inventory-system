import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import pgClient from "../db.js";
import authenticateRole from "../utils/authenticateRole.js";

const router = express.Router();

router
  .use(authenticateRole([1]))
  .get("/", async (req, res) => {
    try {
      const { rows } = await pgClient.query(`
      SELECT U.fname, U.lname, U.email, R.role_title, U.is_verified
      FROM users AS U
      INNER JOIN roles AS R ON U.user_role_id = R.role_id
      WHERE U.user_business_id = $1 AND U.user_role_id != 1
      ;`, [req.user.user_business_id]);
      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  .get("/roles", async (req, res) => {
    try {
      const { rows } = await pgClient.query("SELECT * FROM roles WHERE role_title != 'ADMIN'");
      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  .post("/register", async (req, res) => {
    try {
      const {
        userRoleId,
        email,
        defaultPassword,
        fname,
        lname,
      } = req.body;
      const businessID = req.user.user_business_id;

      const users = await pgClient.query(
        "SELECT email FROM users WHERE email = $1;",
        [email],
      );

      if (users.rowCount > 0) {
        return res.json({
          success: false,
          message: "Email has already been used.",
        });
      }

      const verificationToken = crypto.randomBytes(64).toString("hex");
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await pgClient.query(
        `INSERT INTO users
        (user_business_id, user_role_id, email, password, fname, lname, verification_token)
        VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [businessID, userRoleId, email, hashedPassword, fname, lname, verificationToken],
      );
      const invMsg = `
      <p>Hello ${fname}!
      <br>You have been invited to VISION Inventory Management System by ${req.user.fname} ${req.user.lname}.
      <br><a href="http://localhost:3000/auth/verify-email?token=${verificationToken}&type=emp">
      <br><input type="submit" value="Accept Invitation"/></a>
      </p>`;
      const subject = "Account Invitation for VISION Inventory";
      sendEmail(invMsg, subject, email);

      return res.json({ success: true, message: "Invitation sent successfully!" }); // initation also acts as verification for non-admin users
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

export default router;
