import jwt from "jsonwebtoken";

export function decodeJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
