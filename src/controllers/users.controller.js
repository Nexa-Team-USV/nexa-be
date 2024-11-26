import { User } from "../models/user.model.js";

export const removeAccount = async (req, res) => {
  const userId = req.params.id;

  try {
    const deleteUser = await User.findByIdAndDelete(userId);
    if (!deleteUser) throw new Error("User not found!");
    res.status(200).json({ message: "Account deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
