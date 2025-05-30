import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const authMiddleware = async (req, res, next) => {
    console.log("hn bhai pahch rha yaha tk");
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    console.log(token);

    if (!token) {
        return res.status(401).json({
            status: "error",
            message: "Authentication required",
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
        console.error("Invalid token or user ID");
        return res.status(401).json({
            status: "error",
            message: "Invalid token",
        });
    }
    const objectId = new mongoose.Types.ObjectId(decoded.id);

    // Find the user by ID and exclude the password field
    console.log("Finding user with ID:", objectId);
    const user = await User.findById(objectId).select("-password ");

    console.log("User found:", user);

    if (user=== null) {
        return res.status(401).json({
            status: "error",
            message: "User not found or unauthorized",
        });
    }
console.log("User authenticated successfully:", user);

    req.user = user;
    next();
};

export default authMiddleware;
