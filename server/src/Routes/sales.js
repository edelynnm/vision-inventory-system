import express from "express";
import pgClient from "../db.js";
import authenticateRole from "../utils/authenticateRole.js";

const router = express.Router();

router
  .use(authenticateRole([1, 2]))
  // add items to transaction
  .post("/new-transaction/:id/add", async (req, res) => {
    try {
      const businessID = req.user.business_id;
      const { code, qty } = req.body;
      const transactionID = req.params.id;

      const { rows: transactions } = await pgClient.query(
        `SELECT id FROM business_${businessID}.transactions WHERE id = $1;`,
        [transactionID],
      );

      // // create if does not exists
      if (transactions.length === 0) {
        await pgClient.query(`INSERT INTO business_${businessID}.transactions (id, user_id) VALUES ($1, $2)`, [transactionID, req.user.id]);
      }

      const { rows } = await pgClient.query(`SELECT * FROM business_${businessID}.items WHERE code = $1`, [code]);
      if (rows.length === 0) {
        return res.json({ message: "Item not found" });
      }

      if (rows[0].item_qty < qty) {
        return res.json({ message: "Not enough stocks" });
      }

      const { rows: items } = await pgClient.query(`
        UPDATE business_${businessID}.items SET qty = qty - $1 WHERE code = $2 
        RETURNING brand, specs, unit, unit_price;`,
      [qty, code]);

      const item = items[0];
      const itemName = `${item.brand} ${item.specs}`;
      const total = item.unit_price * qty;

      await pgClient.query(
        `INSERT INTO business_${businessID}.item_transactions (transaction_id, item_code, qty, total_price) VALUES ($1, $2, $3, $4);`,
        [transactionID, code, qty, total],
      );

      return res.json({
        success: true,
        message: "Added",
        itemCode: item.code,
        itemName,
        unit: item.unit,
        unitPrice: item.unit_price,
        qty,
        total,
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  // fetch items bought
  .get("/new-transaction/:id/items", async (req, res) => {
    try {
      const transactionID = req.params.id;

      const { rows } = await pgClient.query(`
        SELECT IT.item_code as code, I.brand, I.specs, I.unit, I.unit_price, IT.qty, IT.total_price 
        FROM business_${req.user.business_id}.item_transactions AS IT
        INNER JOIN business_${req.user.business_id}.items AS I ON I.code = IT.item_code
        WHERE IT.transaction_id = $1
        ORDER by IT.id ASC
        ;
      `, [transactionID]);
      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  // get payment and save
  .post("/save-transaction/:id", async (req, res) => {
    try {
      const transactionID = req.params.id;
      const { payment, total } = req.body;

      if (Number(payment) < Number(total)) {
        return res.json({ success: false, message: "Insufficient payment" });
      }

      const change = Number(payment) - Number(total);

      await pgClient.query(`
        UPDATE business_${req.user.business_id}.transactions
        SET total = $1 WHERE id = $2`,
      [total, transactionID]);

      return res.json({
        success: true,
        change,
        message: "Transaction successful",
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  // cancel transaction
  .delete("/new-transaction/:id", async (req, res) => {
    try {
      const businessID = req.user.business_id;
      const transactionID = req.params.id;
      const { rows: returnItems } = await pgClient.query(`SELECT item_code, qty from business_${businessID}.item_transactions WHERE transaction_id = $1`, [transactionID]);

      let queries = "";
      returnItems.forEach((returnItem) => { queries += `UPDATE business_${businessID}.items SET qty = qty + ${returnItem.qty} WHERE code = ${returnItem.item_code};`; });

      await pgClient.query(queries);
      await pgClient.query(
        `DELETE FROM business_${businessID}.item_transactions WHERE transaction_id = $1;`,
        [transactionID],
      );

      await pgClient.query(
        `DELETE FROM business_${businessID}.transactions WHERE id = $1;`,
        [transactionID],
      );

      return res.json(true);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  .get("/transaction-records", async (req, res) => {
    try {
      const { rows } = await pgClient.query(`
        SELECT T.id, T.date_time as date, T.total, U.fname, U.lname
        FROM business_${req.user.business_id}.transactions AS T
        INNER JOIN users AS U ON U.id = T.user_id
        ORDER BY date DESC;`);
      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

export default router;
