import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  // const token = req.headers.authorization.split(" ")[1];
  const token = req.headers.authorization;

  // console.log(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ message: "Access denied!" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log(user);

    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid token!" });
  }
}
