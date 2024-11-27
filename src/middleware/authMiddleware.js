import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ message: "Access denied!" });
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied!" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid token!" });
  }
}
