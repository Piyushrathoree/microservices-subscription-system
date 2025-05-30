import jwt from "jsonwebtoken";
import axios from "axios";
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.header.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            status: "error",
            message: "Authentication required",
        });
    }
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    const response = await axios.get(`http://localhost:3000/user/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.data) {
        return res.status(401).json({
            status: "error",
            message: "User not found",
        });
    }

    req.user = response.data;
    next();
};

export default authMiddleware;
