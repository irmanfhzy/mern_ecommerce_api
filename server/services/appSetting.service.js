import AppSetting from "../models/appSetting.model.js";
import AppError from "../utils/AppError.js";
import processImage from "../utils/processingImage.js";
import uploadImage from "../utils/uploadingImage.js";
import cloudinary from "../config/cloudinary.js";
import IMAGE_CONFIG from "../constants/image.constant.js";

export const getAppSetting = async () => {
  return await AppSetting.findOne().lean();
};

export const saveAppSetting = async (body, files) => {
  const { appName, about, address, contact } = body;

  const updatedData = {
    appName,
    about,
    address,
    contact,
  };

  const oldSetting = await AppSetting.findOne().lean();

  try {
    if (files?.logo?.[0]) {
      const processedLogo = await processImage(
        files.logo[0].buffer,
        IMAGE_CONFIG.LOGO,
      );

      const uploadedLogo = await uploadImage(processedLogo, "app/logo");

      updatedData.logo = {
        url: uploadedLogo.secure_url,
        publicId: uploadedLogo.public_id,
      };

      if (oldSetting?.logo?.publicId) {
        await cloudinary.uploader.destroy(oldSetting.logo.publicId);
      }
    }

    if (files?.favicon?.[0]) {
      const processedFavicon = await processImage(
        files.favicon[0].buffer,
        IMAGE_CONFIG.FAVICON,
      );

      const uploadedFavicon = await uploadImage(
        processedFavicon,
        "app/favicon",
      );

      updatedData.favicon = {
        url: uploadedFavicon.secure_url,
        publicId: uploadedFavicon.public_id,
      };

      if (oldSetting?.favicon?.publicId) {
        await cloudinary.uploader.destroy(oldSetting.favicon.publicId);
      }
    }

    const newAppSetting = await AppSetting.findOneAndUpdate({}, updatedData, {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    });

    return newAppSetting;
  } catch (error) {
    if (files?.logo?.[0]) {
      await cloudinary.uploader.destroy(updatedData?.logo?.publicId);
    }

    if (files?.favicon?.[0]) {
      await cloudinary.uploader.destroy(updatedData?.favicon?.publicId);
    }

    throw error;
  }
};
