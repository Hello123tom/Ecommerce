import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "backend/config/config.env" });

export const connectDatabase = () => {
    return mongoose.connect(process.env.DB_URI).then(() => {
        console.log("Database connected successfully");
    })
};

export const disconnectDatabase = () => mongoose.disconnect();
