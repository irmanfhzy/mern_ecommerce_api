import mongoose from "mongoose";
import argon2 from "argon2";

import User from "../models/user.model.js";

import * as checker from "../utils/errorChecker.js";
import AppError from "../utils/AppError.js";
import processImage from "../utils/processingImage.js";
import uploadImage from "../utils/uploadingImage.js";
import IMAGE_CONFIG from "../constants/image.constant.js";
import cloudinary from "../config/cloudinary.js";

export const searchUsers = async (name) => {
  const query = {};

  if (name) {
    query.$text = {
      $search: name,
    };
  }

  const users = await User.find(query).lean();

  return users;
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password").lean();

  checker.checkDocument(user, "User not found");

  return user;
};

export const updateProfile = async (userId, body, file) => {
  const { name, gender, dateOfBirth, image } = body;

  const updatedData = {};

  if (name !== undefined) {
    updatedData.name = name;
  }

  if (gender !== undefined) {
    updatedData.gender = gender;
  }

  if (dateOfBirth !== undefined) {
    updatedData.dateOfBirth = dateOfBirth;
  }

  if (Object.keys(updatedData).length === 0) {
    throw new AppError("No data to update", 400);
  }

  const oldProfile = await User.findById(userId)
    .select("image.publicId")
    .lean();

  checker.checkDocument(oldProfile, "User not found");

  const oldImagePublicId = oldProfile.image?.publicId;

  let uploadedImage = null;

  try {
    if (file) {
      const processedImage = await processImage(
        file.buffer,
        IMAGE_CONFIG.PROFILE,
      );

      uploadedImage = await uploadImage(processedImage, `user/${userId}`);

      updatedData.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      runValidators: true,
      returnDocument: "after",
    });

    if (file && oldImagePublicId) {
      await cloudinary.uploader.destroy(oldImagePublicId);
    }

    return updatedUser.toObject();
  } catch (error) {
    if (uploadedImage?.public_id) {
      await cloudinary.uploader.destroy(uploadedImage.public_id);
    }

    throw error;
  }
};

export const updateEmail = async (userId, email) => {
  checker.checkEmail(email);

  const existingUser = await User.findOne({
    email,
    _id: {
      $ne: userId,
    },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      email,
    },
    {
      runValidators: true,
      returnDocument: "after",
    },
  );

  checker.checkDocument(updatedUser, "User not found");

  return updatedUser.toObject();
};

export const updateUsername = async (userId, username) => {
  const existingUser = await User.findOne({
    username,
    _id: {
      $ne: userId,
    },
  });

  if (existingUser) {
    throw new AppError("Username already exists", 409);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      username,
    },
    {
      runValidators: true,
      returnDocument: "after",
    },
  );

  checker.checkDocument(updatedUser, "User not found");

  return updatedUser.toObject();
};

export const updatePhone = async (userId, phone) => {
  checker.checkPhone(phone);

  const existingUser = await User.findOne({
    phone,
    _id: {
      $ne: userId,
    },
  });

  if (existingUser) {
    throw new AppError("Phone already exists", 409);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      phone,
    },
    {
      runValidators: true,
      returnDocument: "after",
    },
  );

  checker.checkDocument(updatedUser, "User not found");

  return updatedUser.toObject();
};

export const addAddress = async (userId, body) => {
  const {
    label = "",
    recipientName,
    phone,
    street,

    villageId,
    village,

    districtId,
    district,

    cityId,
    city,

    provinceId,
    province,

    postalCode,
  } = body;

  let { isDefault = false } = body;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findById(userId)
      .select("addresses")
      .session(session);

    checker.checkDocument(user, "User not found");

    if (user.addresses.length >= 5) {
      throw new AppError("Only 5 addresses allowed", 400);
    }

    if (user.addresses.length === 0) {
      isDefault = true;
    }

    if (isDefault) {
      await User.updateOne(
        {
          _id: userId,
        },
        {
          $set: {
            "addresses.$[elem].isDefault": false,
          },
        },
        {
          session,
          arrayFilters: [
            {
              "elem.isDefault": true,
            },
          ],
        },
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          addresses: {
            label,
            recipientName,
            phone,
            street,

            villageId,
            village,

            districtId,
            district,

            cityId,
            city,

            provinceId,
            province,

            postalCode,
            isDefault,
          },
        },
      },
      {
        session,
        runValidators: true,
        returnDocument: "after",
      },
    );

    await session.commitTransaction();

    return updatedUser;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

export const updateAddress = async (userId, addressId, body) => {
  const {
    label = "",
    recipientName,
    phone,
    street,

    villageId,
    village,

    districtId,
    district,

    cityId,
    city,

    provinceId,
    province,

    postalCode,
  } = body;

  let { isDefault } = body;

  if (typeof isDefault !== "boolean") {
    isDefault = undefined;
  }

  const user = await User.findOne(
    {
      _id: userId,
      "addresses._id": addressId,
    },
    {
      "addresses.$": 1,
    },
  );

  if (!user || !user.addresses[0]) {
    throw new AppError("Address not found", 404);
  }

  if (isDefault === false && user.addresses[0].isDefault === true) {
    throw new AppError("Default address cannot be deactivated", 400);
  }

  const updatedData = {
    "addresses.$.label": label,
    "addresses.$.recipientName": recipientName,
    "addresses.$.phone": phone,
    "addresses.$.street": street,

    "addresses.$.villageId": villageId,
    "addresses.$.village": village,

    "addresses.$.districtId": districtId,
    "addresses.$.district": district,

    "addresses.$.cityId": cityId,
    "addresses.$.city": city,

    "addresses.$.provinceId": provinceId,
    "addresses.$.province": province,

    "addresses.$.postalCode": postalCode,
  };

  if (isDefault !== undefined) {
    updatedData["addresses.$.isDefault"] = isDefault;
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (isDefault === true) {
      await User.updateOne(
        {
          _id: userId,
        },
        {
          $set: {
            "addresses.$[elem].isDefault": false,
          },
        },
        {
          session,
          arrayFilters: [
            {
              "elem.isDefault": true,
            },
          ],
        },
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        "addresses._id": addressId,
      },
      {
        $set: updatedData,
      },
      {
        session,
        runValidators: true,
        returnDocument: "after",
      },
    );

    await session.commitTransaction();

    return updatedUser;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

export const deleteAddress = async (userId, addressId) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const user = await User.findOne(
      {
        _id: userId,
        "addresses._id": addressId,
      },
      {
        "addresses.$": 1,
      },
    ).session(session);

    if (!user) {
      throw new AppError("Address not found", 404);
    }

    const isDefault = user.addresses[0].isDefault;

    await User.updateOne(
      {
        _id: userId,
      },
      {
        $pull: {
          addresses: {
            _id: addressId,
          },
        },
      },
      {
        session,
      },
    );

    const result = {
      deletedAddressId: addressId,
    };

    if (isDefault) {
      const updatedUser = await User.findById(userId)
        .select("addresses")
        .session(session)
        .lean();

      if (updatedUser?.addresses?.length > 0) {
        const newDefaultAddressId = updatedUser.addresses[0]._id;

        await User.updateOne(
          {
            _id: userId,
            "addresses._id": newDefaultAddressId,
          },
          {
            $set: {
              "addresses.$.isDefault": true,
            },
          },
          {
            session,
          },
        );

        result.newDefaultAddressId = newDefaultAddressId;
      }
    }

    await session.commitTransaction();

    return result;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

export const changePassword = async (userId, body) => {
  const { currentPassword, newPassword, confirmNewPassword } = body;

  checker.checkPassword({
    type: "change",
    currentPassword,
    password: newPassword,
    confirmPassword: confirmNewPassword,
  });

  const user = await User.findById(userId).select("+password");

  checker.checkDocument(user, "User not found");

  const isCurrentPasswordValid = await argon2.verify(
    user.password,
    currentPassword,
  );

  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect", 400);
  }

  user.password = await argon2.hash(newPassword);

  await user.save();

  return {
    message: "Password has been changed",
  };
};

export const deleteUserById = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);

  checker.checkDocument(deletedUser, "User not found");

  return deletedUser;
};
