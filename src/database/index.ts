import mongoose from "mongoose";

const connectDb = async (mongoDbUrl: string) => {
  await mongoose.connect(mongoDbUrl);
};

export default connectDb;
