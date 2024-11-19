import mongoose from "mongoose";

export function connectDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log(`Running on port: ${process.env.PORT}`);
    })
    .catch(() => {
      console.log("Something went wrong...");
    });
}
