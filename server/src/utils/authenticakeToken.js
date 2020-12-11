import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No auth header found." });
    }
    const token = authHeader.slice(7);
    return jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ success: false, message: "Invalid token" });
      }
      req.user = user;
      return next();
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
