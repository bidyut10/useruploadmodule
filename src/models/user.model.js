// Import necessary libraries and modules
import mongoose from "mongoose";

// Define the schema for the User model
const UserSchema = new mongoose.Schema(
  {
    // Unique username for the user
    userName: {
      type: String,
      unique: true,
      required: [true, "User is required"],
      trim: true,
      index: true,
    },
    // Password for user authentication (required, min length: 8 characters)
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minLength: 8,
    },
    files: [
      {
        fileName: { type: String },
        code: { type: String },
      },
    ],
  },
  { timestamps: true } // Enable automatic timestamps for created and updated fields
);

// Create and export the User model using the defined schema
export const UserModel = mongoose.model("User", UserSchema);
