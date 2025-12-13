import mongoose from "mongoose";

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection failed", error);
  }
};

export default connectDB;
