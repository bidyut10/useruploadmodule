import express from "express";
import { userRouter } from "./routes/user.route.js";
import cors from 'cors'


//set up the express app
const app = express();

//set coming data
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//cookie setup

// cors setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);


app.use("/api/v.1.0.1/users", userRouter);

export { app };
