import User from "../models/user.model.js";
import argon2 from "argon2";
import { AppError } from "../utils/AppError.js";

export const findUsers = async (name) => {
  if (!name) {
    throw new AppError("Search name is required", 400);
  }
  const users = await User.find({ $text: { $search: name } }).lean();
  if (!users || users.length === 0) {
    return [];
  }
  return users;
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password").lean();
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const updateProfile = async (userId, body) => {
  const { name, gender, dateOfBirth, image } = body;

  const updatedData = {};
  if (name) updatedData.name = name;
  if (gender) updatedData.gender = gender;
  if (dateOfBirth) updatedData.dateOfBirth = dateOfBirth;
  if (image) updatedData.image = image;

  const user = await User.findByIdAndUpdate(userId, updatedData, {
    runValidators: true,
    returnDocument: "after",
  });
  if (!user) {
    throw new AppError("User is not found", 404);
  }
  return user.toObject();
};

export const updateAccount = async (userId, body) => {
  const { email, username, phone } = body;

  if (phone && !/^(08|\+628)[0-9]{8,11}$/.test(String(phone))) {
    throw new AppError("Invalid phone number", 400);
  }

  const updatedData = {};
  if (email && typeof email === "string") updatedData.email = email;
  if (username && typeof username === "string") updatedData.username = username;
  if (phone && typeof phone === "string") updatedData.phone = phone;

  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    runValidators: true,
    returnDocument: "after",
  });

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

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

  let { label, isDefault } = body;

  if (
    !recipientName ||
    !phone ||
    !street ||
    !village ||
    !district ||
    !city ||
    !province ||
    !postalCode
  ) {
    throw new AppError("Address must be completed", 400);
  }

  if (!label) label = "";
  if (typeof isDefault !== "boolean") isDefault = false;

  const userAddress = await User.findById(userId).select("addresses");

  if (!userAddress) {
    throw new AppError("User not found", 404);
  }

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
    { runValidators: true, returnDocument: "after" },
  );

  return addedAddress;
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

  let { label, isDefault } = body;

  if (
    !recipientName ||
    !phone ||
    !street ||
    !village ||
    !district ||
    !city ||
    !province ||
    !postalCode
  ) {
    throw new AppError("Address must be completed", 400);
  }

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

  if (isDefault === true) {
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          "addresses.$[elem].isDefault": false,
        },
      },
      {
        arrayFilters: [{ "elem.isDefault": true }],
      },
    );
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

  const updatedAddress = await User.findOneAndUpdate(
    { _id: userId, "addresses._id": addressId },
    {
      $set: updatedData,
    },
    { runValidators: true, returnDocument: "after" },
  );

  return updatedAddress;
};

export const deleteAddress = async (userId, addressId) => {
  const user = await User.findOne(
    { _id: userId, "addresses._id": addressId },
    { "addresses.$": 1 },
  );

  if (!user || !user.addresses[0]) {
    throw new AppError("Address not found", 404);
  }

  await User.updateOne(
    { _id: userId },
    {
      $pull: {
        addresses: { _id: addressId },
      },
    },
  );

  const isDefault = user.addresses[0].isDefault;
  const leftAddresses = await User.findById(userId).select("addresses").lean();

  if (isDefault && leftAddresses.addresses.length > 0) {
    const newDefaultAddressId = leftAddresses.addresses[0]._id;

    await User.updateOne(
      { _id: userId, "addresses._id": newDefaultAddressId },
      {
        $set: { "addresses.$.isDefault": true },
      },
    );
    return {
      deletedAddressId: addressId,
      newDefaultAddressId,
    };
  }

  return {
    deletedAddressId: addressId,
  };
};

export const changePassword = async (userId, body) => {
  const { currentPassword, newPassword, confirmNewPassword } = body;

  if (!currentPassword || !newPassword || !confirmNewPassword) {
    throw new AppError(
      "Current password, new password, and confirm new password are required",
      400,
    );
  }

  if (newPassword.length < 8) {
    throw new AppError("New password must be at least 8 characters long", 400);
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S+$/.test(newPassword)) {
    throw new AppError(
      "New password must contain at least one uppercase letter, one lowercase letter, and one number",
      400,
    );
  }

  if (newPassword !== confirmNewPassword) {
    throw new AppError(
      "New password and confirm new password do not match",
      400,
    );
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new AppError("User is not found", 404);
  }
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
  if (!deletedUser) {
    throw new AppError("User is not found", 404);
  }
  return deletedUser;
};
