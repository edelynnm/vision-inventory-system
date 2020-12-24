import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendEmail from "../utils/sendEmail.js";
import pgClient from "../db.js";
import authenticateToken from "../utils/authenticakeToken.js";

dotenv.config();

const router = express.Router();
router.post("/signup", async (req, res) => {
  try {
    const verificationToken = crypto.randomBytes(64).toString("hex");
    const {
      email, password, fname, lname, businessName,
    } = req.body;

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

    const businesses = await pgClient.query(
      "INSERT INTO businesses (business_name) VALUES ($1) RETURNING business_id;",
      [businessName],
    );
    const hashedPassword = await bcrypt.hash(password, 10);
    await pgClient.query(
      "INSERT INTO users (user_role_id, user_business_id, email, password, fname, lname, verification_token) VALUES ($1, $2, $3, $4, $5, $6, $7);",
      [
        1,
        businesses.rows[0].business_id,
        email,
        hashedPassword,
        fname,
        lname,
        verificationToken,
      ],
    );

    const verificationMsg = `<p>Hello ${fname}!<br>Please verify that your email is ${email}, and that you entered it when signing up for VISION Inventory Management System.<a href="http://localhost:8000/auth/signup/verify-email?token=${verificationToken}"><br><input type="submit" value="Verify Email"/></a></p>`;
    const subject = "Email Verification for VISION Inventory";
    sendEmail(verificationMsg, subject, email);

    return res.json({
      success: true,
      message: "A verification link has been sent to your email account.",
    });
  } catch (error) {
    console.log(error);
    return res.send(500);
  }
});

router.patch("/signup/verify-email", async (req, res) => {
  try {
    const reqVerificationToken = req.query.token;
    const { rows } = await pgClient.query("SELECT * FROM users WHERE verification_token = $1", [reqVerificationToken]);
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid request." });
    }
    if (rows[0].is_verified) {
      return res.status(409).json({ success: false, message: "Email has already been verified" });
    }

    const users = await pgClient.query("UPDATE users SET is_verified = true WHERE user_id = $1 RETURNING *", [rows[0].user_id]);

    if (users.rows[0].user_id !== 1) {
      const user = users.rows[0];
      ["password", "verification_token"].forEach((prop) => delete user[prop]);
      const token = jwt.sign(user, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "10m" });
      return res.json({ success: true, token });
      // return res.redirect(`employee?token=${reqVerificationToken}`);
    }

    return res.json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pgClient.query("SELECT user_id, user_role_id, user_business_id, fname, lname, email, password, is_verified FROM users WHERE email = $1 AND is_verified = true;", [email]);
    if (rows.length === 0) {
      res.status(400).json({ success: false, message: "Account not found." });
    }
    const validPassword = await bcrypt.compare(password, rows[0].password);
    if (!validPassword) {
      res.status(401).json({ success: false, message: "Incorrect email/password" });
    }
    Reflect.deleteProperty(rows[0], "password");
    const token = jwt.sign(rows[0], process.env.JWT_SECRET, { algorithm: "HS256" }); // EDIT BACK TO 30 mins
    return res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.patch("/signup/employee", authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    await pgClient.query("UPDATE users SET password = $1 WHERE user_id = $2", [hashedPassword, req.user.user_id]);
    return res.json({ success: true, message: "Password successfully changed." });
    // TODO: invoke jwt token before exp
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// TODO: logout & 2 social logins
export default router;
