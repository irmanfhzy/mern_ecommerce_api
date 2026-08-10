import AppError from "../utils/AppError.js";

const normalizeData = (data, rules = {}) => {
  const normalizedData = {};

  for (const [key, value] of Object.entries(data)) {
    let newValue = value;

    const rawRule = rules[key];

    let type = null;
    let nestedRules = {};

    if (typeof rawRule === "string") {
      type = rawRule.toLowerCase().trim();
    } else if (rawRule && typeof rawRule === "object") {
      type = rawRule.type?.toLowerCase().trim();
      nestedRules = rawRule.rules || rawRule;
    }

    if (Array.isArray(newValue)) {
      newValue = newValue.map((item) => {
        if (typeof item === "object" && item !== null) {
          return normalizeData(item, nestedRules);
        }

        return item;
      });

      normalizedData[key] = newValue;
      continue;
    }

    if (typeof newValue === "string") {
      if (type === "raw") {
        normalizedData[key] = newValue;
        continue;
      }

      newValue = newValue.trim();

      if (type === "lowercase") {
        newValue = newValue.toLowerCase();
      }

      if (type === "uppercase") {
        newValue = newValue.toUpperCase();
      }

      if (type === "titlecase") {
        newValue = newValue
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }

      if (type === "number") {
        if (newValue === "") {
          throw new AppError("Number cannot be empty", 400);
        }

        const parsed = Number(newValue);

        if (Number.isNaN(parsed)) {
          throw new AppError("Invalid number format", 400);
        }

        newValue = parsed;
      }

      if (type === "phoneid") {
        if (newValue.startsWith("62")) {
          newValue = "+" + newValue;
        } else if (newValue.startsWith("08")) {
          newValue = "+62" + newValue.slice(1);
        } else if (newValue.startsWith("8")) {
          newValue = "+62" + newValue;
        }
      }

      if (type === "json") {
        try {
          newValue = JSON.parse(newValue);
        } catch {
          throw new AppError(`${key} must be valid JSON`, 400);
        }

        if (Array.isArray(newValue)) {
          newValue = newValue.map((item) =>
            typeof item === "object" && item !== null
              ? normalizeData(item, nestedRules)
              : item,
          );
        } else if (typeof newValue === "object" && newValue !== null) {
          newValue = normalizeData(newValue, nestedRules);
        }
      }
    }

    normalizedData[key] = newValue;
  }

  return normalizedData;
};

export default normalizeData;
