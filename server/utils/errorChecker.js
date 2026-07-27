import AppError from "./AppError.js";

export const checkPhone = (
  value,
  message = "Invalid phone number",
  status = 400,
) => {
  if (value && !/^(08|\+628)[0-9]{8,11}$/.test(String(value))) {
    throw new AppError(message, status);
  }
};

export const checkEmail = (
  value,
  message = "Invalid email format",
  status = 400,
) => {
  if (!/^[a-zA-Z0-9_.%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/.test(value)) {
    throw new AppError(message, status);
  }
};

export const checkPassword = ({
  type,
  currentPassword,
  newPassword,
  confirmNewPassword,
}) => {
  type = type?.toLowerCase();
  if (newPassword.length < 8) {
    throw new AppError("Password must be at least 8 characters long", 400);
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(newPassword)) {
    throw new AppError(
      "Password must include uppercase, lowercase, and number",
      400,
    );
  }

  if (
    (type === "register" || type === "change") &&
    newPassword !== confirmNewPassword
  ) {
    throw new AppError("Password and password confirmation do not match", 400);
  }

  if (type === "change" && currentPassword === newPassword) {
    throw new AppError(
      "New password must be different from current password",
      400,
    );
  }
};

export const checkDocument = (
  value,
  message = "Document not found",
  status = 404,
) => {
  if (!value) {
    throw new AppError(message, status);
  }
};
