export const roles = {
  admin: [
    "create-account",
    "remove-account",
    "retrieve-current-user",
    "edit-profile",
    "reset-password",
    "retrieve-users",
  ],
  teacher: [
    "retrieve-current-user",
    "edit-profile",
    "reset-password",
    "schedule",
    "remove-scheduling",
    "edit-scheduling",
  ],
  student: [
    "edit-profile",
    "retrieve-current-user",
    "reset-password",
    "proposal",
  ],
  all: [
    "retrieve-user",
    "retrieve-schedulings",
    "retrieve-classrooms",
    "send-exam-proposal",
  ],
};
