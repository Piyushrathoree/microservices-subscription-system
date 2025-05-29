import jwt from "jsonwebtoken";
import axios from "axios";
const authMiddleware = async (req, res, next) => {
    
        try {
            const token =
                req.cookies.token || req.header.authorization?.split(" ")[1];
    
            if (!token) {
                return res.status(401).json({
                    status: "error",
                    message: "Authentication required",
                });
            }
            console.log(
                token
            );
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token:", decoded);
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
            console.error("Authentication error:", error);
            return res.status(401).json({
                status: "error",
                message: "Invalid token or user not found",
            });
            
        }
    
};

export default authMiddleware;
