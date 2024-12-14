export const roles = {
  admin: [
    "create-account",
    "remove-account",
    "retrieve-current-user",
    "retrieve-user",
    "edit-profile",
    "reset-password",
    "retrieve-users",
    "retrieve-schedulings",
    "retrieve-classrooms",
  ],
  teacher: [
    "retrieve-current-user",
    "retrieve-user",
    "edit-profile",
    "reset-password",
    "schedule",
    "retrieve-schedulings",
    "retrieve-classrooms",
  ],
  student: [
    "edit-profile",
    "retrieve-current-user",
    "retrieve-user",
    "reset-password",
    "schedule",
    "retrieve-schedulings",
    "retrieve-classrooms",
  ],
};
