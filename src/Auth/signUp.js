import bcrypt from "bcrypt";
import crypto from "crypto";
import sendEmail from "../sendEmail.js";

export default (pgClient, res, req) => {
  const {
    userRoleId,
    username,
    password,
    fname,
    lname,
    email,
    businessName,
    businessCode,
  } = req.body;
  pgClient.query(
    `SELECT username FROM users WHERE username ILIKE '${username}' `,
    (pgError, result) => {
      if (pgError) {
        console.log(pgError);
        res.send(500);
      } else if (result.rows.length > 0) {
        // if username has match
        res.json({ success: false, message: "Username is already taken." });
      } else {
        const verificationToken = crypto.randomBytes(64).toString("hex");
        const salt = 13;
        const newUserSQL = `
        WITH new_business AS (
          INSERT INTO businesses (business_name, business_code) VALUES ($1, $2) RETURNING business_id
        )
        INSERT INTO users (user_role_id, user_business_id, username, password, fname, lname, email, verification_token)
          VALUES ($3, (SELECT business_id from new_business), $4, $5, $6, $7, $8, $9) RETURNING *;
        `;
        bcrypt.hash(password, salt, (_bcryptPasswordErr, hashedPassword) => {
          bcrypt.hash(businessCode, salt, (_bcryptCodeErr, hashedBusinessCode) => {
            pgClient.query(
              newUserSQL,
              [
                businessName,
                hashedBusinessCode,
                userRoleId,
                username,
                hashedPassword,
                fname,
                lname,
                email,
                verificationToken,
              ],
              (queryError, { rows }) => {
                if (queryError) {
                  console.log(queryError);
                  res.send(500);
                } else {
                  Reflect.deleteProperty(rows[0], "password");
                  const verificationMsg = `<p>Hello ${fname}!<br>Please verify that your email is ${email}, and that you entered it when signing up for VISION Inventory Management System.<a href="http://localhost:8000/signUp/verifyEmail?token=${verificationToken}"><br><input type="submit" value="Verify Email"/></a></p>`;
                  const subject = "Email Verification for VISION Inventory";
                  sendEmail(verificationMsg, subject, email);
                  res.status(200).json({ success: true, message: "A verification link has been sent to your email account." });
                }
              },
            );
          });
        });
      }
    },
  );
};
