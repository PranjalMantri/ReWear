import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import connectDb from "./db/connectDb.ts";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

import userRouter from "./routes/user.router.ts";
import errorHandler from "./middlewares/errorHandler.ts";

app.use("/api/v1/user", userRouter);
app.use(errorHandler);

app.listen(port, async () => {
  console.log(`Server listening on http://localhost:${port}`);
  await connectDb();
});
