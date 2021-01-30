import express from "express";
import pgClient from "../db.js";
import authenticateRole from "../utils/authenticateRole.js";

const router = express.Router();

router
  .use(authenticateRole([1]))
  .get("/", async (req, res) => {
    try {
      const businessID = req.user.business_id;
      const { rows } = await pgClient.query(
        `
        SELECT IT.item_code, SUM(IT.qty) sold, I.brand, I.specs, I.unit_price, I.unit, DATE(T.date_time)                               
        FROM business_${businessID}.item_transactions AS IT
        INNER JOIN business_${businessID}.items AS I ON IT.item_code = I.code
        INNER JOIN business_${businessID}.transactions AS T ON T.id = IT.transaction_id
        INNER JOIN users AS U ON U.id = T.user_id
        GROUP BY IT.item_code, I.brand, I.specs, I.unit_price, I.unit, date;
        `,
      );
      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

export default router;
