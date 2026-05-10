import mongoose from "mongoose";
import argon2 from "argon2";
import User from "../models/user.model.js";
import * as checker from "../utils/errorChecker.js";
import { AppError } from "../utils/AppError.js";

export const findUsers = async (name) => {
  checker.checkInputs({ name }, "name is required for searching users");
  const users = await User.find({ $text: { $search: name } }).lean();
  return users;
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password").lean();
  checker.checkDoc(user, "User not found");
  return user;
};

export const updateProfile = async (userId, body) => {
  const { name, gender, dateOfBirth, image } = body;

  const updatedData = {};
  if (name !== undefined) updatedData.name = name;
  if (gender !== undefined) updatedData.gender = gender;
  if (dateOfBirth !== undefined) updatedData.dateOfBirth = dateOfBirth;
  if (image !== undefined) updatedData.image = image;

  if (Object.keys(updatedData).length === 0) {
    throw new AppError("No data to update", 400);
  }

  const user = await User.findByIdAndUpdate(userId, updatedData, {
    runValidators: true,
    returnDocument: "after",
  });
  checker.checkDoc(user, "User not found");
  return user.toObject();
};

export const updateAccount = async (userId, body) => {
  const { email, username, phone } = body;

  const updatedData = {};
  if (email && typeof email === "string") {
    checker.checkEmail(email);
    updatedData.email = email;
  }
  if (username && typeof username === "string") {
    updatedData.username = username;
  }
  if (phone && typeof phone === "string") {
    checker.checkPhone(phone);
    updatedData.phone = phone;
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    runValidators: true,
    returnDocument: "after",
  });

  checker.checkDoc(updatedUser, "User not found");

  return updatedUser.toObject();
};

export const addAddress = async (userId, body) => {
  const {
    recipientName,
    phone,
    street,
    village,
    district,
    city,
    province,
    postalCode,
  } = body;

  checker.checkInputs(
    {
      recipientName,
      phone,
      street,
      village,
      district,
      city,
      province,
      postalCode,
    },
    "Address must be completed",
  );

  let { label, isDefault } = body;

  if (!label) label = "";
  if (typeof isDefault !== "boolean") isDefault = false;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userAddress = await User.findById(userId).select("addresses");
    checker.checkDoc(userAddress, "User not found");

    if (userAddress.addresses.length >= 5) {
      throw new AppError("Only 5 addresses allowed", 400);
    }

    if (userAddress.addresses.length === 0) isDefault = true;
    if (isDefault === true) {
      await User.updateOne(
        { _id: userId },
        {
          $set: {
            "addresses.$[elem].isDefault": false,
          },
        },
        {
          session,
          arrayFilters: [{ "elem.isDefault": true }],
        },
      );
    }

    const addedAddress = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          addresses: {
            label,
            recipientName,
            phone,
            street,
            village,
            district,
            city,
            province,
            postalCode,
            isDefault,
          },
        },
      },
      { session, runValidators: true, returnDocument: "after" },
    );

    await session.commitTransaction();

    return addedAddress;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const updateAddress = async (userId, addressId, body) => {
  const {
    recipientName,
    phone,
    street,
    village,
    district,
    city,
    province,
    postalCode,
  } = body;

  checker.checkInputs(
    {
      recipientName,
      phone,
      street,
      village,
      district,
      city,
      province,
      postalCode,
    },
    "Address must be completed",
  );

  let { label, isDefault } = body;

  if (!label) label = "";
  if (typeof isDefault !== "boolean") isDefault = undefined;

  const user = await User.findOne(
    { _id: userId, "addresses._id": addressId },
    { "addresses.$": 1 },
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
    "addresses.$.village": village,
    "addresses.$.district": district,
    "addresses.$.city": city,
    "addresses.$.province": province,
    "addresses.$.postalCode": postalCode,
  };

  if (isDefault !== undefined) updatedData["addresses.$.isDefault"] = isDefault;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (isDefault === true) {
      await User.updateOne(
        { _id: userId },
        {
          $set: {
            "addresses.$[elem].isDefault": false,
          },
        },
        {
          session,
          arrayFilters: [{ "elem.isDefault": true }],
        },
      );
    }

    const updatedAddress = await User.findOneAndUpdate(
      { _id: userId, "addresses._id": addressId },
      {
        $set: updatedData,
      },
      { session, runValidators: true, returnDocument: "after" },
    );

    await session.commitTransaction();

    return updatedAddress;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
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
      { _id: userId },
      {
        $pull: {
          addresses: { _id: addressId },
        },
      },
      { session },
    );

    let result = {
      deletedAddressId: addressId,
    };

    if (isDefault) {
      const updatedUser = await User.findById(userId)
        .select("addresses")
        .session(session)
        .lean();

      if (updatedUser && updatedUser.addresses.length > 0) {
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
          { session },
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
    session.endSession();
  }
};

export const changePassword = async (userId, body) => {
  const { currentPassword, newPassword, confirmNewPassword } = body;
  checker.checkInputs({ currentPassword, newPassword, confirmNewPassword });

  checker.checkPassword({
    type: "change",
    currentPassword,
    password: newPassword,
    confirmPassword: confirmNewPassword,
  });

  const user = await User.findById(userId).select("+password");
  checker.checkDoc(user, "User not found");

  const isCurrentPasswordValid = await argon2.verify(
    user.password,
    currentPassword,
  );
  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect", 400);
  }

  user.password = await argon2.hash(newPassword);
  await user.save();

  return { message: "Password has been changed" };
};

export const deleteUserById = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  checker.checkDoc(deletedUser, "User not found");
  return deletedUser;
};
