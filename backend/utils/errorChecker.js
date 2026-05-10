import { AppError } from "./AppError";

export const checkInputs = (values, message, status = 400) => {
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null || value === "") {
      throw new AppError(message ?? `${key.toUpperCase()} is required`, status);
    }
  }
};

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
  password,
  confirmPassword,
}) => {
  type = type?.toLowerCase();
  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters long", 400);
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
    throw new AppError(
      "Password must include uppercase, lowercase, and number",
      400,
    );
  }

  if (
    (type === "register" || type === "change") &&
    password !== confirmPassword
  ) {
    throw new AppError("Password and password confirmation do not match", 400);
  }

  if (type === "change" && currentPassword === password) {
    throw new AppError(
      "New password must be different from current password",
      400,
    );
  }
};

export const checkDoc = (
  value,
  message = "Document not found",
  status = 404,
) => {
  if (!value) {
    throw new AppError(message, status);
  }
};

export const checkObjectId = (
  value,
  message = "Invalid ObjectId",
  status = 400,
) => {
  if (value && !mongoose.Types.ObjectId.isValid(value)) {
    throw new AppError(message, status);
  }
};
