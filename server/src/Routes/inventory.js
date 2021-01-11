import express from "express";
import pgClient from "../db.js";
import authenticateRole from "../utils/authenticateRole.js";

const router = express.Router();

router
  // Display all items
  .get("/", async (req, res) => {
    try {
      const { rows } = await pgClient.query("SELECT * FROM items WHERE business_id = $1 ORDER BY date_time DESC;", [req.user.user_business_id]);

      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  .use(authenticateRole([1, 3]))
  .post("/new-item", async (req, res) => {
    try {
      const {
        itemCode,
        itemBrand,
        itemSpecs,
        itemQty,
        itemUnitPrice,
        itemUnit,
        reorderPoint,
      } = req.body;

      const query = {
        text: `INSERT INTO items
           (business_id, item_code, item_brand, item_specs, item_qty,
           item_unit_price, item_unit, reorder_point)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        values: [
          req.user.user_business_id,
          itemCode,
          itemBrand,
          itemSpecs,
          itemQty,
          itemUnitPrice,
          itemUnit,
          reorderPoint,
        ],
      };

      // new item validation
      const { rows } = await pgClient.query("SELECT * FROM items WHERE item_code = $1", [
        itemCode,
      ]);

      if (rows.length !== 0) {
        return res.json({ success: false, message: "Item already exists." });
      }

      await pgClient.query(query);
      return res.json({
        success: true,
        message: "New item added to inventory",
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  .post("/restock", async (req, res) => {
    try {
      const { itemQty, itemCode } = req.body;

      // item validation
      const { rows } = await pgClient.query("SELECT * FROM items WHERE item_code = $1", [itemCode]);

      if (rows.length === 0) {
        return res.json({ success: false, message: "Item does not exist." });
      }

      await pgClient.query("UPDATE items SET item_qty = item_qty + $1 WHERE item_code = $2;",
        [itemQty, itemCode]);

      await pgClient.query("INSERT INTO restock_records (additional_qty, item_code, user_id) VALUES ($1, $2, $3);",
        [itemQty, itemCode, req.user.user_id]);

      return res.json({
        success: true,
        message: "Item successfully restocked",
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  .get("/restock-records", async (req, res) => {
    try {
      const { rows } = await pgClient.query(`SELECT R.item_code, R.additional_qty, R.restock_date_time, U.fname, U.lname, I.item_brand, I.item_specs, I.item_unit FROM restock_records AS R
      INNER JOIN items AS I ON I.item_code = R.item_code
      INNER JOIN users AS U ON U.user_id = R.user_id
      WHERE U.user_business_id = $1;`, [req.user.user_business_id]);

      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

export default router;
