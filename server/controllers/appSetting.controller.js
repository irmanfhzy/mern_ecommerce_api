import * as appSettingService from "../services/appSetting.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAppSetting = asyncHandler(async (req, res) => {
  const data = await appSettingService.getAppSetting();
  res.status(200).json({ success: true, data });
});

export const saveAppSetting = asyncHandler(async (req, res) => {
  const data = await appSettingService.saveAppSetting(req.body, req.files);
  res
    .status(200)
    .json({ success: true, message: "App setting saved successfully", data });
});
