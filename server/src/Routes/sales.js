import express from "express";
import pgClient from "../db.js";
import authenticateRole from "../utils/authenticateRole.js";

const router = express.Router();

router
  .use(authenticateRole([3, 5]))
  // create new transaction *going back means deleting this one
  .post("/new-transaction", async (req, res) => {
    try {
      const transactionID = Date.now();
      await pgClient.query("INSERT INTO transaction_records VALUES ($1);", [transactionID]);
      // return res.redirect(`/new-transaction/${transactionID}/add`);
      return res.json({ message: "New transaction created.", id: transactionID });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  // add items to transaction
  .post("/new-transaction/:id/add", async (req, res) => {
    try {
      const { itemCode, qty } = req.body;
      const transactionID = req.params.id;

      const { rows: transactions } = await pgClient.query("SELECT transaction_id FROM transaction_records WHERE transaction_id = $1;", [transactionID]);

      if (transactions.length === 0) {
        return res.sendStatus(404);
      }

      const { rows } = await pgClient.query("SELECT * FROM items WHERE item_code = $1", [itemCode]);
      if (rows.length === 0) {
        return res.json({ message: "Item not found" });
      }

      if (rows[0].item_qty < qty) {
        return res.json({ message: "Not enough stocks" });
      }

      const remainingQty = rows[0].item_qty - qty;
      const { rows: items } = await pgClient.query(
        "UPDATE items SET item_qty = $1 WHERE item_code = $2 RETURNING item_code, item_brand, item_specs, item_unit, item_unit_price;",
        [remainingQty, itemCode],
      );
      const item = items[0];
      const itemName = `${item.item_brand}-${item.item_specs}`;
      const total = item.item_unit_price * qty;

      await pgClient.query("INSERT INTO item_transactions (transaction_id, item_code, qty, total_price) VALUES ($1, $2, $3, $4);",
        [transactionID, itemCode, qty, total]);

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
  // get payment and save
  .post("/save-transaction/:id", async (req, res) => {
    try {
      const transactionID = req.params.id;
      const { payment } = req.body;
      const { rows: transactions } = await pgClient.query("SELECT * from transactions WHERE transaction_id = $1",
        [transactionID]);

      if (transactions.length > 0) {
        return res.sendStatus(409);
      }

      const { rows } = await pgClient.query(`SELECT COALESCE(SUM(total_price), 0) AS total FROM (SELECT * FROM item_transactions
      WHERE transaction_id = $1
      ORDER BY item_code ASC) AS transaction;`,
      [transactionID]);
      const totalAmount = rows[0].total;
      if (payment < totalAmount) {
        return res.json({ success: false, message: "Payment not enough" });
      }
      const change = payment - totalAmount;
      await pgClient.query(`
      INSERT INTO transactions (transaction_id, transaction_user_id, transaction_payment)
      VALUES ($1, $2, $3);`,
      [transactionID, req.user.user_id, payment]);
      return res.json({ success: true, change, message: "Transaction successful" });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

export default router;
