import express from "express";
import pgClient from "../db.js";
import authenticateRole from "../utils/authenticateRole.js";

const router = express.Router();

router
  // Display all items + search by item name - fetch at inventory page selection
  .get("/", async (req, res) => {
    try {
      const query = {
        text: // `SELECT * from items`
        `SELECT item_code as id,
        CONCAT_WS(' ', item_brand, item_specs) AS item_desc,
        item_qty, item_unit_price,
        item_unit, reorder_point,
        C.category_name
        FROM items as I
        INNER JOIN categories as C ON I.item_category_code = C.category_code
        -- WHERE item_brand ILIKE $1 OR item_specs ILIKE $1
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
  .use(authenticateRole([2, 3]))
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
        text:
          `INSERT INTO items
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
      const { rows } = await pgClient.query("SELECT * FROM items WHERE item_code = $1", [itemCode]);

      if (rows.length !== 0) return res.status(409).json({ success: false, message: "Item already exists." });

      await pgClient.query(query);
      return res.json({
        success: true,
        message: "New item added to inventory",
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

export default router;
