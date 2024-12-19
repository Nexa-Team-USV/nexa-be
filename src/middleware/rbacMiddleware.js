import { roles } from "../config/roles.js";
import { decodeJWT } from "../utils/decodeJWT.js";

export function rbacMiddleware(req, res, next) {
  try {
    const isAllAuthorized = roles.all.some((permission) =>
      req.url.includes(permission)
    );

    if (isAllAuthorized) {
      return next();
    }

    const token = req.headers.authorization.split(" ")[1];
    const user = decodeJWT(token);

    const permissions = roles[user.role];

    const isAuthorized = permissions.some((permission) =>
      req.url.includes(permission)
    );

    if (isAuthorized) {
      return next();
    } else {
      throw new Error("Access denied");
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
}
