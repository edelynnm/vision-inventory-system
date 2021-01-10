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
        SELECT T.item_code, SUM(T.qty) sold, I.item_brand, I.item_specs, I.item_unit_price, I.item_unit                                
        FROM item_transactions AS T
        INNER JOIN items AS I ON T.item_code = I.item_code
        GROUP BY T.item_code, I.item_brand, I.item_specs, I.item_unit_price, I.item_unit;
        `,
      );
      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

export default router;
