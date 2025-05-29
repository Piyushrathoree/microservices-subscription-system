import jwt from "jsonwebtoken";
import axios from "axios";
const authMiddleware = async (req, res, next) => {
    try {
        const token =
            req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Authentication required",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const response = await axios.get(
            `${process.env.USER_SERVICE_URL}/user/${decoded.id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.data || !response.data.user) {
            return res.status(401).json({
                status: "error",
                message: "User not found",
            });
        }

        req.user = response.data;
        next();
    } catch (error) {
        res.status(401).json({
            status: "error",
            message: "Invalid token",
        });
    }
};

export default authMiddleware;
