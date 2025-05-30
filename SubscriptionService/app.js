import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { router as subscriptionRouter } from "./routes/subscription.route.js";
import './service/checkExpiry.js'
dotenv.config();

const app = express();

// Essential Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


app.use("/", subscriptionRouter);

export default app;
