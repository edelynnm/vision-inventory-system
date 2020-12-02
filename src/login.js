import bcrypt from "bcrypt";

export default (pgClient, req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = $1";

  pgClient.query(sql, [username], (queryError, { rows }) => {
    if (queryError) {
      console.log(queryError);
      res.status(500).json({ queryError });
    } else {
      bcrypt.compare(password, rows[0].password, (_compareErr, result) => {
        Reflect.deleteProperty(rows[0], "password"); // deletes object property (JS delete operator)
        res
          .status(result ? 200 : 401)
          .json({ success: result, user: result ? rows[0] : null });
      });
    }
  });
};
