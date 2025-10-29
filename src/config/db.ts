import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("MONGO_URI not found!");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("DB connection successfully!");
  } catch (err: any) {
    console.error("Connetion failed with MongoDB!", err.message);
    process.exit(1);
  }
};
