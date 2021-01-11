import express from "express";
import pgClient from "../db.js";
import authenticateRole from "../utils/authenticateRole.js";

const router = express.Router();

router
  .use(authenticateRole([1, 2]))
  // add items to transaction
  .post("/new-transaction/:id/add", async (req, res) => {
    try {
      const { code, qty } = req.body;
      const transactionID = req.params.id;

      const {
        rows: transactions,
      } = await pgClient.query(
        "SELECT transaction_id FROM transaction_records WHERE transaction_id = $1;",
        [transactionID],
      );

      // create if does not exists
      if (transactions.length === 0) {
        await pgClient.query("INSERT INTO transaction_records VALUES ($1);", [transactionID]);
      }

      const { rows } = await pgClient.query("SELECT * FROM items WHERE item_code = $1", [code]);
      if (rows.length === 0) {
        return res.json({ message: "Item not found" });
      }

      if (rows[0].item_qty < qty) {
        return res.json({ message: "Not enough stocks" });
      }

      const { rows: items } = await pgClient.query(`
        UPDATE items SET item_qty = item_qty - $1 WHERE item_code = $2 
        RETURNING item_code, item_brand, item_specs, item_unit, item_unit_price;`,
      [qty, code]);

      const item = items[0];
      const itemName = `${item.item_brand} ${item.item_specs}`;
      const total = item.item_unit_price * qty;

      await pgClient.query(
        "INSERT INTO item_transactions (transaction_id, item_code, qty, total_price) VALUES ($1, $2, $3, $4);",
        [transactionID, code, qty, total],
      );

      return res.json({
        success: true,
        message: "Added",
        itemCode: item.item_code,
        itemName,
        unit: item.item_unit,
        unitPrice: item.item_unit_price,
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
        SELECT T.item_code, I.item_brand, I.item_specs, I.item_unit, I.item_unit_price, T.qty, T.total_price 
        FROM item_transactions AS T
        INNER JOIN items AS I ON I.item_code = T.item_code
        WHERE T.transaction_id = $1;
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
        INSERT INTO transactions (transaction_id, transaction_user_id, total)
        VALUES ($1, $2, $3);`,
      [transactionID, req.user.user_id, total]);

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
      const transactionID = req.params.id;
      const { rows: returnItems } = await pgClient.query("SELECT item_code, qty from item_transactions WHERE transaction_id = $1", [transactionID]);

      let queries = "";
      returnItems.forEach((item) => { queries += `UPDATE items SET item_qty = item_qty + ${item.qty} WHERE item_code = ${item.item_code};`; });

      await pgClient.query(queries);
      await pgClient.query(
        "DELETE FROM item_transactions WHERE transaction_id = $1;",
        [transactionID],
      );

      await pgClient.query(
        "DELETE FROM transaction_records WHERE transaction_id = $1;",
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
        SELECT T.transaction_id, T.transaction_date_time, T.total, U.fname, U.lname
        FROM transactions AS T
        INNER JOIN users AS U ON U.user_id = T.transaction_user_id
        WHERE U.user_business_id = $1
        ORDER BY T.transaction_date_time DESC;
      `, [req.user.user_business_id]);
      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

export default router;
