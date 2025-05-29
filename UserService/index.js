import app from "./app.js";
import { config } from "dotenv";
import connectDB from "./db/db.js";
config();

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
