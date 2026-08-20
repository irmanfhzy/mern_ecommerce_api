const requestFilesSchemas = {
  profile: {
    update: {
      avatar: {
        max: 1,
      },
    },
  },

  product: {
    create: {
      productImages: {
        required: true,
        min: 1,
        max: 10,
      },
    },

    update: {
      productImages: {
        min: 1,
        max: 10,
      },
    },
  },

  variant: {
    create: {
      variantImages: {
        required: true,
        min: 1,
        max: 10,
      },
    },

    update: {
      variantImages: {
        min: 1,
        max: 10,
      },
    },
  },

  appSetting: {
    save: {
      logo: {
        max: 1,
      },

      favicon: {
        max: 1,
      },
    },
  },
};

export default requestFilesSchemas;
