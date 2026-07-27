import mongoose from "mongoose";

const generateOrderNumber = () => {
  const orderId = new mongoose.Types.ObjectId();

  const orderNumber = `ORD-${Date.now()}-${orderId
    .toString()
    .slice(-6)
    .toUpperCase()}`;

  return {
    orderId,
    orderNumber,
  };
};

export default generateOrderNumber;
