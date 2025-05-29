import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

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

    // Find the user by ID and exclude the password field
    console.log("Finding user with ID:", decoded.id);
    const user = await User.findById(decoded.id).select("-password");
    console.log("User found:", user);

    if (!user) {
        return res.status(401).json({
            status: "error",
            message: "User not found",
        });
    }

    req.user = user;
    next();
};

export default authMiddleware;
