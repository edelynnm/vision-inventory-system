import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import pgClient from "../db.js";

const router = express.Router();

router
  .post("/register", async (req, res) => {
    try {
      if (req.user.user_role_id !== 1) return res.status(401).json({ message: "You don't have permission to visit this page." });

      const {
        userRoleId,
        email,
        defaultPassword,
        fname,
        lname,
      } = req.body;

      const verificationToken = crypto.randomBytes(64).toString("hex");
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      await pgClient.query(
        `INSERT INTO users
        (user_business_id, user_role_id, email, password, fname, lname, verification_token)
        VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [req.user.user_business_id, userRoleId, email, hashedPassword, fname, lname, verificationToken],
      );
      const invMsg = `
      <p>Hello ${fname}!
      <br>You have been invited to VISION Inventory Management System by ${req.user.fname} ${req.user.lname}.
      <br><a href="http://localhost:8000/api/signup/verify-email?token=${verificationToken}">
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
