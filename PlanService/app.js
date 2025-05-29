import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error.middleware.js";
import { router as userRouter } from "./routes/user.route.js";

dotenv.config();

const app = express();

// Essential Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

// Routes
app.use("/api/users", userRouter);

// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "success", 
        message: "Server is healthy" 
    });
});


// Error Handler
app.use(errorHandler);

export default app;
