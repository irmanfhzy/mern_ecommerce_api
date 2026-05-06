export const registerRules = {
  name: "titlecase",
  email: "lowercase",
  password: "raw",
  confirmPassword: "raw",
};

export const loginRules = {
  identifier: "lowercase",
  password: "raw",
};

export const addressRules = {
  label: "titlecase",
  recipientName: "titlecase",
  phone: "phoneid",
  street: "titlecase",
  village: "titlecase",
  district: "titlecase",
  city: "titlecase",
  province: "titlecase",
};

export const profileRules = {
  name: "titlecase",
  gender: "lowercase",
};

export const accountRules = {
  email: "lowercase",
  username: "lowercase",
  phone: "phoneid",
};

export const variantRules = {
  attributes: {
    key: "lowercase",
    value: "lowercase",
  },
  sku: "uppercase",
  stock: "number",
  price: "number",
};
