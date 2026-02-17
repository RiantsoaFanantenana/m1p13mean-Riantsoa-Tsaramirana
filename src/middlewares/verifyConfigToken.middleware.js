import { verifyConfigToken } from "../services/shop.services.js";

export const configTokenMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const user = await verifyConfigToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};
