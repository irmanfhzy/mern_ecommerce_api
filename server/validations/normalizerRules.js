export const rules = {
  auth: {
    register: {
      name: "titlecase",
      email: "lowercase",
      password: "raw",
      confirmPassword: "raw",
    },

    login: {
      identifier: "lowercase",
      password: "raw",
    },
  },

  profile: {
    update: {
      name: "titlecase",
      gender: "lowercase",
    },
  },

  account: {
    email: {
      email: "lowercase",
    },

    username: {
      username: "lowercase",
    },

    phone: {
      phone: "phoneid",
    },
  },

  address: {
    create: {
      label: "titlecase",
      recipientName: "titlecase",
      phone: "phoneid",
      street: "titlecase",
      village: "titlecase",
      district: "titlecase",
      city: "titlecase",
      province: "titlecase",
    },

    update: {
      label: "titlecase",
      recipientName: "titlecase",
      phone: "phoneid",
      street: "titlecase",
      village: "titlecase",
      district: "titlecase",
      city: "titlecase",
      province: "titlecase",
    },
  },
  product: {
    create: {
      name: "titlecase",
      brand: "titlecase",
    },

    update: {
      name: "titlecase",
      brand: "titlecase",
    },
  },
  variant: {
    create: {
      attributes: {
        key: "lowercase",
        value: "lowercase",
      },
      sku: "uppercase",
      stock: "number",
      price: "number",
    },

    update: {
      attributes: {
        key: "lowercase",
        value: "lowercase",
      },
      sku: "uppercase",
      stock: "number",
      price: "number",
    },
  },

  stock: {
    update: {
      quantity: "number",
    },
  },
};

export default rules;
