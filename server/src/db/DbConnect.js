import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


async function connectionMongoDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Mongo DB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
export default  connectionMongoDB 