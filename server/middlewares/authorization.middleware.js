import AppError from "../utils/AppError.js";

const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    const role = req.user?.role;

    if (!role) {
      throw new AppError("Unauthorized", 401);
    }

    if (!allowedRoles.includes(role)) {
      throw new AppError("Access is forbidden", 403);
    }

    next();
  };

export default authorize;
