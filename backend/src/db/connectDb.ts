import mongoose from "mongoose";

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Successfully connected to the database");
  } catch (error) {
    console.log("Something went wrong while connecting to the database");
    process.exit(1);
  }
}

export default connectDb;
