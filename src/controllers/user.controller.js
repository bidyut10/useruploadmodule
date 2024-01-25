import fs from "fs/promises";
import { UserModel } from "../models/user.model.js";
import { asyncTryCatchHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createUser = asyncTryCatchHandler(async (req, res) => {
  const { userName, password } = req.body;

  if ([userName, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await UserModel.findOne({ userName, password });

  if (existingUser) {
    throw new ApiError(409, "User is already exist");
  }

  // Create a new user
  const newUser = await UserModel.create({ userName, password });

  await newUser.save();

  return res
    .status(201)
    .json(new ApiResponse(200, newUser, "User registered Successfully"));
});

const loginUser = asyncTryCatchHandler(async (req, res) => {
  const { userName, password } = req.body;

  if ([userName, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await UserModel.findOne({ userName, password });

  if (!existingUser) {
    throw new ApiError(401, "Invalid credentials");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, existingUser, "Login successful"));
});

const uploadFile = asyncTryCatchHandler(async (req, res) => {
  const { user, file } = req;

  if ([user, file].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const code = shortid.generate();
  const filename = file.filename;

  // Save file information in user schema
  user.files.push({ filename, code });
  await user.save();

  // Save file in the local system
  const destinationPath = `./public/temp/${filename}`;
  await fs.rename(file.path, destinationPath);

  // Save file information in MongoDB
  const uploadedFile = new File({ filename, code, user: user._id });
  await uploadedFile.save();

  return res
    .status(200)
    .json(new ApiResponse(200, uploadedFile, "File Uploaded Successfully"));
});

const getUserFiles = asyncTryCatchHandler(async (req, res) => {
  const { user } = req;

  if (!user) {
    throw new ApiError(400, "Invalid User");
  }

  return res.status(200).json(new ApiResponse(200, user.files, "Success"));
});

const DownloadFile = asyncTryCatchHandler(async (req, res) => {
  const { code, filename } = req.params;

  if ([code, filename].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const filePath = `./public/temp/${filename}`;

  if (
    await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false)
  ) {
    if (
      code ===
      User.findOne({ "files.filename": filename }).files.find(
        (file) => file.filename === filename
      ).code
    ) {
      res.download(filePath);
    } else {
      throw new ApiError(403, "Invalid code");
    }
  } else {
    throw new ApiError(404, "File not found");
  }
});

const DeleteFile = asyncTryCatchHandler(async (req, res) => {
  const { user } = req;

  if (!user) {
    throw new ApiError(400, "Invalid User");
  }

  const { filename } = req.params;

  const fileIndex = user.files.findIndex((f) => f.filename === filename);

  if (fileIndex !== -1) {
    const filePath = `./uploads/${filename}`;
    await fs.unlink(filePath);
    user.files.splice(fileIndex, 1);
    await user.save();
    res
      .status(200)
      .json(new ApiResponse(200, user.files, "File removed successfully"));
  } else {
    throw new ApiError(404, "File not found");
  }
});

export {
  createUser,
  loginUser,
  uploadFile,
  getUserFiles,
  DownloadFile,
  DeleteFile,
};
