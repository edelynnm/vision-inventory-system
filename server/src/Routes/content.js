import express from "express";
import authenticateToken from "../utils/authenticakeToken.js";

const router = express.Router();

router.get("/dashboard", authenticateToken, (req, res) => {
  res.send(req.user);
});

export default router;
