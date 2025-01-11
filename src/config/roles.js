export const roles = {
  admin: [
    "create-account",
    "remove-account",
    "current-user",
    "edit-profile",
    "reset-password",
    "retrieve-users",
  ],
  teacher: ["current-user", "edit-profile", "reset-password"],
  student: ["edit-profile", "current-user", "reset-password", "proposal"],
};
