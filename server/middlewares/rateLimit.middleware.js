import rateLimit from "express-rate-limit";

const createRateLimiter = ({
  seconds,
  limit,
  message = "Too many requests. Please try again later.",
}) => {
  const limiter = rateLimit({
    windowMs: seconds * 1000,
    limit: limit,
    message: {
      success: false,
      message,
    },
  });

  return limiter;
};

export default createRateLimiter;
