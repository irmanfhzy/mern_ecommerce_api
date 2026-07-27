export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const PAYMENT_METHOD = {
  COD: "cash_on_delivery",
  BANK_TRANSFER: "bank_transfer",
  E_WALLET: "e_wallet",
};

export const INVENTORY_TYPE = {
  IN: "in",
  OUT: "out",
};

export const INVENTORY_REASON = {
  INITIAL: "initial",
  RESTOCK: "restock",
  ORDER: "order",
  CANCELLED: "cancelled order",

  ADJUSTMENT: "adjustment",
  DAMAGED: "damaged",
  LOST: "lost",
  RETURN: "return",
};

export const ROLE = {
  ADMIN: "admin",
  USER: "user",
};

export const GENDER = {
  MALE: "male",
  FEMALE: "female",
};
