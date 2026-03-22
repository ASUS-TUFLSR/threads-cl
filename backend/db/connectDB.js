import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongo DB connected ${conn.connection.host}`);
    } catch (error) {
        console.log("Error connecting mongoDB", error);
        process.exit(1);
    }
}

export default connectDB;