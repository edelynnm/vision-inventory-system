import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default (pgClient, req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = $1";

  pgClient.query(sql, [username], (queryError, { rows }) => {
    if (queryError) {
      console.log(queryError);
      res.status(500).json({ queryError });
    } else {
      bcrypt.compare(password, rows[0].password, (compareErr, result) => {
        Reflect.deleteProperty(rows[0], "password"); // deletes object property (JS delete operator)
        if (compareErr || !result) {
          res
            .status(401)
            .json({ success: false, user: null });
        } else {
          jwt.sign(rows[0], process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "2h" }, (jwtError, token) => {
            res
              .status(200)
              .json({ success: true, token });
          });
        }
      });
    }
  });
};
