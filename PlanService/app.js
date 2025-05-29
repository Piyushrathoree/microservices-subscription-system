import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { router as planRouter } from "./routes/plan.route.js";
import authMiddleware from "../UserService/middleware/user.middleware.js";

dotenv.config();

const app = express();
// Essential Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use(authMiddleware)
app.use("/api/plans", planRouter);

export default app;
