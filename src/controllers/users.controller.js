import { User } from "../models/user.model.js";
import { decodeJWT } from "../utils/decodeJWT.js";

export const getCurrentUser = async (req, res) => {
  const headers = req.headers;

  try {
    const userId = decodeJWT(headers.authorization).id;

    const query = await User.findById(userId);

    const user = {
      _id: query._id,
      username: query.username,
      email: query.email,
      specialization: query.specialization,
      group: query.group,
      role: query.role,
      createdAt: query.createdAt,
    };

    if (!user) {
      throw new Error("User not found!");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
