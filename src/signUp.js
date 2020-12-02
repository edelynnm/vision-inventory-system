import bcrypt from "bcrypt";

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
        res.send(500).json({ pgError });
      } else if (result.rows.length > 0) {
        // if username has match
        res.json({ success: false, message: "Username is already taken." });
      } else {
        const salt = 13;
        const newUserSQL = `
        WITH new_business AS (
          INSERT INTO businesses (business_name, business_code) VALUES ($1, $2) RETURNING business_id
        )
        INSERT INTO users (user_role_id, user_business_id, username, password, fname, lname, email)
          VALUES ($3, (SELECT business_id from new_business), $4, $5, $6, $7, $8) RETURNING *;
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
              ],
              (queryError, { rows }) => {
                if (queryError) {
                  console.log(queryError);
                  res.send(500).json({ queryError });
                } else {
                  res.json({ success: true, user: rows[0] });
                }
              },
            );
          });
        });
      }
    },
  );
};
