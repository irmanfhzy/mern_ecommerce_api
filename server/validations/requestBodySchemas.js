const requestBodySchemas = {
  auth: {
    register: {
      required: ["name", "email", "password", "confirmPassword"],
    },

    login: {
      required: ["identifier", "password"],
    },
  },

  profile: {
    update: {
      notEmpty: ["name", "gender"],
    },
  },

  account: {
    email: {
      required: ["email"],
    },

    username: {
      required: ["username"],
    },

    phone: {
      required: ["phone"],
    },
  },

  password: {
    update: {
      required: ["currentPassword", "newPassword", "confirmNewPassword"],
    },
  },

  address: {
    create: {
      required: [
        "recipientName",
        "phone",
        "street",

        "villageId",
        "village",

        "districtId",
        "district",

        "cityId",
        "city",

        "provinceId",
        "province",

        "postalCode",
      ],
    },

    update: {
      notEmpty: [
        "recipientName",
        "phone",
        "street",

        "villageId",
        "village",

        "districtId",
        "district",

        "cityId",
        "city",

        "provinceId",
        "province",

        "postalCode",
      ],
    },
  },
  product: {
    create: {
      required: ["name"],
    },

    update: {
      notEmpty: ["name"],
    },
  },

  variant: {
    create: {
      required: ["sku", "stock", "price"],
    },

    update: {
      notEmpty: ["sku"],
    },
  },

  stock: {
    update: {
      required: ["quantity"],
    },
  },
  cart: {
    add: {
      required: ["quantity"],
    },

    changeVariant: {
      required: ["newVariantId"],
    },

    updateQuantity: {
      required: ["quantity"],
    },
  },
  appSetting: {
    save: {
      required: ["appName", "about"],
    },
  },
};

export default requestBodySchemas;
