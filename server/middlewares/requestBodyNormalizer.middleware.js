import normalizeData from "../utils/dataNormalizer.js";

const normalizeRequest =
  (rules = {}) =>
  (req, res, next) => {
    req.body = normalizeData(req.body, rules);
    next();
  };

export default normalizeRequest;
