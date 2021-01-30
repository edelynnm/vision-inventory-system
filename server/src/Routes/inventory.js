import express from "express";
import pgClient from "../db.js";
import authenticateRole from "../utils/authenticateRole.js";

const router = express.Router();

router
  // Display all items
  .get("/", async (req, res) => {
    try {
      const { rows } = await pgClient.query(`SELECT * FROM business_${req.user.business_id}.items ORDER BY date_time DESC;`);

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
        text: `INSERT INTO business_${req.user.business_id}.items
           (code, brand, specs, qty, unit_price, unit, reorder_point)
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

      // new item validation
      const { rows } = await pgClient.query(`SELECT * FROM business_${req.user.business_id}.items WHERE code = $1`,
        [itemCode]);

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
      const businessID = req.user.business_id;

      // item validation
      const { rows } = await pgClient.query(`SELECT * FROM business_${businessID}.items WHERE code = $1`, [itemCode]);

      if (rows.length === 0) {
        return res.json({ success: false, message: "Item does not exist." });
      }

      await pgClient.query(`UPDATE business_${businessID}.items SET qty = qty + $1 WHERE code = $2;`,
        [itemQty, itemCode]);

      await pgClient.query(`INSERT INTO business_${businessID}.restock_records (additional_qty, item_code, user_id) VALUES ($1, $2, $3);`,
        [itemQty, itemCode, req.user.id]);

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
      const businessID = req.user.business_id;
      const { rows } = await pgClient.query(`
      SELECT R.item_code as code, R.additional_qty, R.restock_date_time, U.fname, U.lname, I.brand, I.specs, I.unit
      FROM business_${businessID}.restock_records AS R
      INNER JOIN business_${businessID}.items AS I ON I.code = R.item_code
      INNER JOIN users AS U ON U.id = R.user_id
      ORDER BY R.restock_date_time DESC
      ;`);

      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

export default router;
