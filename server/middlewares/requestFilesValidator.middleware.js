import AppError from "../utils/AppError.js";

const validateRequestFiles = (schema = {}) => {
  return (req, res, next) => {
    if (!schema || typeof schema !== "object") {
      throw new AppError("Invalid file validation schema", 500);
    }

    for (const [field, options] of Object.entries(schema)) {
      const { required = false, min = 0, max = Infinity } = options;

      let files = [];

      if (req.file && req.file.fieldname === field) {
        files = [req.file];
      } else if (Array.isArray(req.files)) {
        files = req.files.filter(
          (file) =>
            file.fieldname === field || file.fieldname.startsWith(`${field}`),
        );
      } else if (req.files?.[field]) {
        files = req.files[field];
      }

      const count = files.length;

      if (required && count === 0) {
        throw new AppError(`${field} is required`, 400);
      }

      if (count > 0 && count < min) {
        throw new AppError(
          `${field} must contain at least ${min} file(s)`,
          400,
        );
      }

      if (count > max) {
        throw new AppError(
          `${field} cannot contain more than ${max} file(s)`,
          400,
        );
      }
    }

    next();
  };
};

export default validateRequestFiles;
