import express from "express";
import authenticateToken from "../utils/authenticakeToken.js";
import pgClient from "../db.js";

const router = express.Router();

router
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
