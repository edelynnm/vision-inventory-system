const verifyEmail = (pgClient, req, res) => {
  const verificationToken = req.query.token;

  pgClient.query("SELECT * FROM users WHERE verification_token = $1", [verificationToken], (pgError, { rows }) => {
    const user = rows[0];
    if (pgError) {
      console.log(pgError);
      res.send(500);
    } else if (user.is_verified === false) {
      pgClient.query("UPDATE users SET is_verified = true WHERE user_id = $1", [user.user_id], (pgErr) => {
        if (pgErr) {
          res.send(500).json({ pgErr });
        } else {
          res.json({ success: true, message: "Email verified successfully!" });
        }
      });
    } else {
      res.json({ success: false, message: "Email has already been verified" });
    }
  });
};

export default verifyEmail;
