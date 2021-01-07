import express from "express";
import pgClient from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      rows,
    } = await pgClient.query(
      "SELECT business_name FROM businesses WHERE business_id = $1",
      [req.user.user_business_id],
    );
    return res.json({
      fname: req.user.fname,
      lname: req.user.lname,
      roleID: req.user.user_role_id,
      businessName: rows[0].business_name,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

export default router;
