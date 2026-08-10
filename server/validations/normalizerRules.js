const rules = {
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

  variant: {
    create: {
      attributes: {
        type: "json",
        rules: {
          key: "lowercase",
          value: "lowercase",
        },
      },
      sku: "uppercase",
      stock: "number",
      costPrice: "number",
      sellingPrice: "number",
    },

    update: {
      attributes: {
        type: "json",
        rules: {
          key: "lowercase",
          value: "lowercase",
        },
      },
      sku: "uppercase",
      stock: "number",
      costPrice: "number",
      sellingPrice: "number",
    },
  },

  stock: {
    update: {
      quantity: "number",
    },
  },

  appSetting: {
    save: {
      appName: "titlecase",
      about: "trim",

      address: {
        type: "json",
        rules: {
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

      contact: {
        type: "json",
        rules: {
          label: "titlecase",
          value: "trim",
          link: "trim",
        },
      },
    },
  },
};

export default rules;
