import { AppError } from "../utils/AppError.js";

const normalizeData = (data, rules = {}) => {
  const normalizedData = {};

  for (const [key, value] of Object.entries(data)) {
    let newValue = value;

    const rawRule = rules[key];
    const rule =
      typeof rawRule === "string" ? rawRule.toLowerCase().trim() : rawRule;

    if (Array.isArray(value)) {
      newValue = value.map((item) => {
        if (typeof item === "object" && item !== null) {
          return normalizeData(item, rule || {});
        }
        return item;
      });

      normalizedData[key] = newValue;
      continue;
    }

    if (typeof value === "string") {
      if (rule === "raw") {
        normalizedData[key] = newValue;
        continue;
      }

      newValue = value.trim();

      if (rule === "lowercase") {
        newValue = newValue.toLowerCase();
      }

      if (rule === "uppercase") {
        newValue = newValue.toUpperCase();
      }

      if (rule === "titlecase") {
        newValue = newValue
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }

      if (rule === "number") {
        if (newValue === "") {
          throw new AppError("Number cannot be empty", 400);
        }

        const parsed = Number(newValue);

        if (Number.isNaN(parsed)) {
          throw new AppError("Invalid number format", 400);
        }

        newValue = parsed;
      }

      if (rule === "phoneid") {
        if (newValue.startsWith("62")) {
          newValue = "+" + newValue;
        } else if (newValue.startsWith("08")) {
          newValue = "+62" + newValue.slice(1);
        } else if (newValue.startsWith("8")) {
          newValue = "+62" + newValue;
        }
      }
    }

    normalizedData[key] = newValue;
  }

  return normalizedData;
};

export default normalizeData;
