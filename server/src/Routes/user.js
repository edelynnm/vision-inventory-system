import express from "express";
import pgClient from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { rows: businesses } = await pgClient.query(
      "SELECT name FROM businesses WHERE id = $1",
      [req.user.business_id],
    );
    return res.json({
      fname: req.user.fname,
      lname: req.user.lname,
      roleID: req.user.role_id,
      businessName: businesses[0].name,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

export default router;
