import AppSetting from "../models/appSetting.model.js";
import processImage from "../utils/processingImage.js";
import uploadImage from "../utils/uploadingImage.js";
import cloudinary from "../config/cloudinary.js";
import IMAGE_CONFIG from "../constants/image.constant.js";
import sanitizeAbout from "../utils/sanitizeHtml.js";

export const getAppSetting = async () => {
  return await AppSetting.findOne().lean();
};

export const saveAppSetting = async (body, files) => {
  const { appName, about, address, contact, removeLogo, removeFavicon } = body;

  const updatedData = {
    appName,
    about: sanitizeAbout(about),
    address,
    contact,
  };

  const oldSetting = await AppSetting.findOne().lean();

  try {
    // Upload logo baru
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
    } else if (removeLogo === "true") {
      updatedData.logo = null;
    }

    // Upload favicon baru
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
    } else if (removeFavicon === "true") {
      updatedData.favicon = null;
    }

    const newAppSetting = await AppSetting.findOneAndUpdate({}, updatedData, {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    });

    // Hapus logo lama setelah DB berhasil diupdate
    if (
      (files?.logo?.[0] || removeLogo === "true") &&
      oldSetting?.logo?.publicId
    ) {
      await cloudinary.uploader.destroy(oldSetting.logo.publicId);
    }

    // Hapus favicon lama setelah DB berhasil diupdate
    if (
      (files?.favicon?.[0] || removeFavicon === "true") &&
      oldSetting?.favicon?.publicId
    ) {
      await cloudinary.uploader.destroy(oldSetting.favicon.publicId);
    }

    return newAppSetting;
  } catch (error) {
    // Hapus upload baru jika update DB gagal
    if (updatedData.logo?.publicId) {
      await cloudinary.uploader.destroy(updatedData.logo.publicId);
    }

    if (updatedData.favicon?.publicId) {
      await cloudinary.uploader.destroy(updatedData.favicon.publicId);
    }

    throw error;
  }
};
