import { UserModel } from "../models/user.model.js";
import { asyncTryCatchHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const authUserMiddleware = asyncTryCatchHandler(async (req, res, next) => {
  const { userName, password } = req.headers;

  if ([userName, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await UserModel.findOne({ userName, password });

  if (existingUser) {
    req.user = user;
    next();
  } else {
    return res.status(401).json(new ApiResponse(401, newUser, "Unauthorized"));
  }
});

export { authUserMiddleware };
