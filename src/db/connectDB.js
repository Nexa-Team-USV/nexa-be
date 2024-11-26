import mongoose from "mongoose";

export const mongooseClient = new mongoose.Mongoose();

export function connectDB() {
  mongooseClient
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log(`Running on port: ${process.env.PORT}`);
    })
    .catch((error) => {
      console.log(error);
      console.log("Error at DB connection: ", error);
    });
}
