import express from "express";
import authenticateToken from "../utils/authenticakeToken.js";
import pgClient from "../db.js";

const router = express.Router();

router
  // Display all products + search by product name - fetch at inventory page selection
  .get("/inventory", authenticateToken, async (req, res) => {
    try {
      const { input } = req.body;
      const query = {
        text: `SELECT product_code,
        CONCAT_WS(' ', product_brand, product_specs) AS product_desc,
        product_qty, product_unit_price,
        product_unit, reorder_point,
        C.category_name
        FROM products as P
        INNER JOIN categories as C ON P.product_category_code = C.category_code
        WHERE product_brand ILIKE $1 OR product_specs ILIKE $1
        ORDER BY product_desc ASC;`,
        values: [`%${input}%`],
      };
      const { rows } = await pgClient.query(query);
      return res.json(rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  // New item
  .post("/inventory/add-new-product", authenticateToken, async (req, res) => {
    try {
      if ([2, 3].includes(req.user.user_role_id)) {
        return res
          .status(401)
          .json({ message: "You don't have permission to visit this page." });
      }
      const {
        productCode,
        productCategoryCode,
        productBrand,
        productSpecs,
        productQty,
        productUnitPrice,
        productUnit,
        reorderPoint,
      } = req.body;
      const query = {
        text:
          "INSERT INTO products (product_code, product_category_code, product_brand, product_specs, product_qty, product_unit_price, product_unit, reorder_point) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        values: [
          productCode,
          productCategoryCode,
          productBrand,
          productSpecs,
          productQty,
          productUnitPrice,
          productUnit,
          reorderPoint,
        ],
      };

      await pgClient.query(query);
      return res.json({
        success: true,
        message: "New product added to inventory",
      });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  })
  // New Category
  .post("/inventory/add-new-category", authenticateToken, async (req, res) => {
    try {
      if ([2, 3].includes(req.user.user_role_id)) {
        return res
          .status(401)
          .json({ message: "You don't have permission to visit this page." });
      }
      const {
        categoryName,
        parentCategoryCode,
      } = req.body;

      const query = {
        text: "INSERT INTO categories (category_name, parent_category_code) VALUES ($1, $2)",
        values: [categoryName, parentCategoryCode],
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
