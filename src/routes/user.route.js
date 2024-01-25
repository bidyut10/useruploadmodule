// Import necessary modules and dependencies
import { Router } from "express";
import {
  DeleteFile,
  DownloadFile,
  createUser,
  getUserFiles,
  loginUser,
  uploadFile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authUserMiddleware } from "../auth/credentials.auth.js";

// Create an Express Router instance
const userRouter = Router();

// User Api Endpoints
userRouter.post("/create_user", createUser);
userRouter.post("/login_user", loginUser);

userRouter.post(
  "/upload_file",
  authUserMiddleware,
  upload.single("file"),
  uploadFile
);

userRouter.get("/user_files", authUserMiddleware, getUserFiles);

userRouter.get("/download/:code/:filename", authUserMiddleware, DownloadFile);
userRouter.get("/files/:filename", authUserMiddleware, DeleteFile);

// Export the user router for use in other parts of the application
export { userRouter };
