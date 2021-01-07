import express from "express";
import pgClient from "../db.js";
import authenticateRole from "../utils/authenticateRole.js";

const router = express.Router();

router
  // Display all items
  .get("/", async (req, res) => {
    try {
      const query = {
        text: `SELECT item_code,
        CONCAT_WS(' ', item_brand, item_specs) AS item_desc,
        item_qty, item_unit_price,
        item_unit, reorder_point
        FROM items
        ORDER BY item_desc ASC;
        `,
      };
      const { rows } = await pgClient.query(query);
      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  .use(authenticateRole([2]))
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
           (item_code, item_brand, item_specs, item_qty,
           item_unit_price, item_unit, reorder_point)
           VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        values: [
          itemCode,
          itemBrand,
          itemSpecs,
          itemQty,
          itemUnitPrice,
          itemUnit,
          reorderPoint,
        ],
      };
      const {
        rows,
      } = await pgClient.query("SELECT * FROM items WHERE item_code = $1", [
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
  });

export default router;
