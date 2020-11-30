import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

// eslint-disable-next-line import/extensions
import pool from './db.js';

const app = express();

pool.connect((error, pgClient) => {
  if (error) {
    console.log('ERROR: Cannot connect to Postgres.');
    process.exit(1);
  }

  app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static('public'))

  // AUTHENTICATION
  // business owner login

    .post('/login', (req, res) => {
      const { username, password } = req.body;
      const sql = 'SELECT * FROM users WHERE username = $1';

      pgClient.query(sql, [username], (queryError, { rows }) => {
        if (queryError) {
          console.log(error);
          res.status(500).json({ error });
        } else {
          bcrypt.compare(password, rows[0].password, (_compareErr, result) => {
            // eslint-disable-next-line no-param-reassign
            delete rows[0].password; // deletes object property (JS delete operator)
            res
              .status(result ? 200 : 401)
              .json({ success: result, user: result ? rows[0] : null });
          });
        }
      });
    })

  // business owner sign up
    .post('/signUp', (req, res) => {
      const salt = 13;
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
            res.json({ success: false, message: 'Username is already taken.' });
          } else {
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
    })

    .listen(8000, () => {
      console.log('Server has started: http://localhost:8000');
    });
});
