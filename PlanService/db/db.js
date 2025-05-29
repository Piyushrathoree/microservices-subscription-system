import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.set("bufferCommands", false);

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);

        process.exit(1);
    }
};

mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
});

export default connectDB;
