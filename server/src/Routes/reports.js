import express from "express";
import pgClient from "../db.js";
import authenticateRole from "../utils/authenticateRole.js";

const router = express.Router();

router
  .use(authenticateRole([1]))
  .get("/", async (req, res) => {
    try {
      const { rows } = await pgClient.query(
        `
        SELECT T.item_code, SUM(T.qty) sold, I.item_brand, I.item_specs, I.item_unit_price, I.item_unit, DATE(R.transaction_date_time)                               
        FROM item_transactions AS T
        INNER JOIN items AS I ON T.item_code = I.item_code
        INNER JOIN transactions AS R ON R.transaction_id = T.transaction_id
        INNER JOIN users AS U ON U.user_id = R.transaction_user_id
        WHERE U.user_business_id = $1
        GROUP BY T.item_code, I.item_brand, I.item_specs, I.item_unit_price, I.item_unit, date;
        `,
        [req.user.user_business_id],
      );
      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

export default router;
