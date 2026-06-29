import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

const validateObjectId =
  (source = "params", key = "id") =>
  (req, res, next) => {
    const id = req[source]?.[key];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid ID format", 400);
    }

    next();
  };

export default validateObjectId;
