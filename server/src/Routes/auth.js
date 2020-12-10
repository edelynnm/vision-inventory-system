import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import pgClient from "../db.js";

const router = express.Router();

router.post("/signUp", async (req, res) => {
  try {
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

    const verificationToken = crypto.randomBytes(64).toString("hex");
    const businesses = await pgClient.query(
      "INSERT INTO businesses (business_name) VALUES ($1) RETURNING business_id;",
      [businessName],
    );
    const hashPassword = await bcrypt.hash(password, 13);
    await pgClient.query(
      "INSERT INTO users (user_role_id, user_business_id, email, password, fname, lname, verification_token) VALUES ($1, $2, $3, $4, $5, $6, $7);",
      [
        1,
        businesses.rows[0].business_id,
        email,
        hashPassword,
        fname,
        lname,
        verificationToken,
      ],
    );

    const verificationMsg = `<p>Hello ${fname}!<br>Please verify that your email is ${email}, and that you entered it when signing up for VISION Inventory Management System.<a href="http://localhost:8000/auth/signUp/verifyEmail?token=${verificationToken}"><br><input type="submit" value="Verify Email"/></a></p>`;
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

router.patch("/signUp/verifyEmail", async (req, res) => {
  try {
    const verificationToken = req.query.token;
    const result = await pgClient.query("SELECT * FROM users WHERE verification_token = $1", [verificationToken]);
    if (result.rowCount === 0) {
      return res.send(400);
    }
    if (result.rows[0].is_verified) {
      return res.json({ success: false, message: "Email has already been verified" });
    }
    await pgClient.query("UPDATE users SET is_verified = true WHERE user_id = $1", [result.rows[0].user_id]);
    return res.json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    console.log(error);
    return res.send(500);
  }
});

export default router;
