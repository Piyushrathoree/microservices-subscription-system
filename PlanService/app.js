import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { router as planRouter } from "./routes/plan.route.js";

dotenv.config();

const app = express();
// Essential Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


app.use("/", planRouter);

export default app;
