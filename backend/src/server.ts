import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDb from "./db/connectDb.ts";

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`Server listening on http://localhost:${port}`);
  await connectDb();
});
