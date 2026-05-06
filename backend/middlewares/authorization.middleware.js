import { AppError } from "../utils/AppError";

const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    const role = req.user.role;
    if (!user || allowedRoles.inclodes("user")) {
      throw new AppError("Access is forbidden", 403);
    }
    next();
  };

export default authorize;
