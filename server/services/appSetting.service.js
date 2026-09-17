import AppSetting from "../models/appSetting.model.js";

import processImage from "../utils/processingImage.js";
import uploadImage from "../utils/uploadingImage.js";
import sanitizeHtmlValue from "../utils/sanitizeHtml.js";

import cloudinary from "../config/cloudinary.js";

import IMAGE_CONFIG from "../constants/image.constant.js";


export const getAppSetting = async () => {
  return await AppSetting.findOne().lean();
};

export const saveAppSetting = async (body, files) => {
  const {
    appName,
    appDescription,
    about,
    address,
    contact,
    socialMedia,
    removeLogo,
    removeFavicon,
  } = body;

  const updatedData = {
    appName,
    appDescription,
    about: sanitizeHtmlValue(about),
    address,
    contact,
    socialMedia,
  };

  const oldSetting = await AppSetting.findOne().lean();

  let uploadedLogo = null;
  let uploadedFavicon = null;

  try {
    if (files?.logo?.[0]) {
      const processedLogo = await processImage(
        files.logo[0].buffer,
        IMAGE_CONFIG.HEADER_LOGO,
      );

      uploadedLogo = await uploadImage(processedLogo, "CommerSale/app/logo");

      updatedData.logo = {
        url: uploadedLogo.secure_url,
        publicId: uploadedLogo.public_id,
      };
    } else if (removeLogo === "true") {
      updatedData.logo = null;
    }

    if (files?.favicon?.[0]) {
      const processedFavicon = await processImage(
        files.favicon[0].buffer,
        IMAGE_CONFIG.FAVICON,
      );

      uploadedFavicon = await uploadImage(
        processedFavicon,
        "CommerSale/app/favicon",
      );

      updatedData.favicon = {
        url: uploadedFavicon.secure_url,
        publicId: uploadedFavicon.public_id,
      };
    } else if (removeFavicon === "true") {
      updatedData.favicon = null;
    }

    const newAppSetting = await AppSetting.findOneAndUpdate({}, updatedData, {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    }).lean();

    if ((uploadedLogo || removeLogo === "true") && oldSetting?.logo?.publicId) {
      await cloudinary.uploader.destroy(oldSetting.logo.publicId);
    }

    if (
      (uploadedFavicon || removeFavicon === "true") &&
      oldSetting?.favicon?.publicId
    ) {
      await cloudinary.uploader.destroy(oldSetting.favicon.publicId);
    }

    return newAppSetting;
  } catch (error) {
    if (uploadedLogo?.public_id) {
      await cloudinary.uploader.destroy(uploadedLogo.public_id);
    }

    if (uploadedFavicon?.public_id) {
      await cloudinary.uploader.destroy(uploadedFavicon.public_id);
    }

    throw error;
  }
};
