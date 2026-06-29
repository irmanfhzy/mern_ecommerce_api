import AppError from "../utils/AppError.js";

const validateRequestBody = (schema) => {
  return (req, res, next) => {
    if (!schema || typeof schema !== "object") {
      throw new AppError("Invalid request schema", 500);
    }

    if (Object.keys(req.body).length === 0) {
      throw new AppError("Request body cannot be empty", 400);
    }

    const requiredFields = schema.required || [];

    const notEmptyFields = schema.notEmpty || [];

    for (const field of requiredFields) {
      const value = req.body[field];

      if (value === undefined || value === null || value === "") {
        throw new AppError(`${field} is required`, 400);
      }
    }

    for (const field of notEmptyFields) {
      if (field in req.body) {
        const value = req.body[field];

        if (value === null || value === "") {
          throw new AppError(`${field} cannot be empty`, 400);
        }
      }
    }

    next();
  };
};

export default validateRequestBody;
