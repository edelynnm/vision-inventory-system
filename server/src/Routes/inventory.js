import express from "express";
import pgClient from "../db.js";
import authenticateRole from "../utils/authenticateRole.js";

const router = express.Router();

router
  // Display all items + search by item name - fetch at inventory page selection
  .get("/", async (req, res) => {
    try {
      // const { searchWord } = req.body;
      const query = {
        text: // `SELECT * from items`
        `SELECT item_code,
        CONCAT_WS(' ', item_brand, item_specs) AS item_desc,
        item_qty, item_unit_price,
        item_unit, reorder_point,
        C.category_name
        FROM items as I
        INNER JOIN categories as C ON I.item_category_code = C.category_code
        -- WHERE item_brand ILIKE $1 OR item_specs ILIKE $1
        ORDER BY item_desc ASC;
        `,
        // values: [`%${searchWord}%`],
      };
      const { rows } = await pgClient.query(query);
      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  // display by category
  .get("/by-category", async (req, res) => {
    try {
      const { selectedCategory } = req.body;
      const { rows } = await pgClient.query(`SELECT item_code,
      CONCAT_WS(' ', item_brand, item_specs) AS item_desc,
      item_qty, item_unit_price,
      item_unit, reorder_point
      --, C.category_name
      FROM items AS I
      INNER JOIN categories as C ON I.item_category_code = C.category_code
      WHERE C.category_name ILIKE $1`, [selectedCategory]);
      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  // New item
  .use(authenticateRole([2, 3]))
  .post("/new-item", async (req, res) => {
    try {
      const {
        itemCode,
        itemCategoryCode,
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
           (item_code, item_category_code, item_brand, item_specs, item_qty,
           item_unit_price, item_unit, reorder_point)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        values: [
          itemCode,
          itemCategoryCode,
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
  })
  // New Category
  .post("/new-category", async (req, res) => {
    try {
      const { categoryName } = req.body;

      const { rows } = await pgClient.query("SELECT * FROM categories WHERE category_name ILIKE $1", [categoryName]);

      if (rows.length !== 0) return res.status(409).json({ success: false, message: "Category already exists." });

      const query = {
        text: "INSERT INTO categories (category_name) VALUES ($1)",
        values: [categoryName],
      };

      await pgClient.query(query);
      return res.json({
        success: true,
        message: "New category added.",
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  });

export default router;

/*
QUERYING PARENT CATEGORIES WITH CHILD:
const firstQ =  SELECT p.category_name AS parent_category, c.category_name as child_category FROM categories as p INNER JOIN categories as c ON  q.category_code = c.parent_category_code ORDER BY parent_category ASC

THEN
filter firstQ result, sort alphabetically
const secondQ = firstQ.rows.filter(category => category.parentName === reqParenntName)

SELECTING PARENT CATEGORIES:

SELECT category_code, category_name FROM categories WHERE parent_category_code is null
;

SELECTING ALL CHILD CATEGORIES [propbably wont use]
SELECT category_code, category_name from categories where parent_category_code is not null
*/
