
import axios from "axios";
const authMiddleware = async (req, res, next) => {
        console.log("Auth middleware triggered");
        const token =
            req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Authentication required",
            });
        }

        const response = await axios.get(
            `${process.env.USER_SERVICE_URL}/user/profile`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.data ) {
            return res.status(401).json({
                status: "error",
                message: "User not found",
            });
        }

        req.user = response.data;
        next();
   
};

export default authMiddleware;
