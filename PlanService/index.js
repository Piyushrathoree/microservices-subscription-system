import app from "./app.js";
import { config } from "dotenv";
import connectDB from "./db/db.js";
import rabbitMQService from "./service/rabbit.js";

config();

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Connect to RabbitMQ
        await rabbitMQService.connect();

        // Subscribe to relevant events
        await rabbitMQService.subscribeToPlanEvents(
            "plan-service-user-events",
            async (message) => {
                console.log("Received user event:", message);
                // here I can Handle user events (e.g., user deletion affecting plans)
            }
        );

        // Start server
        const port = process.env.PORT || 3002;
        app.listen(port, () => {
            console.log(`Plan Service running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

// Handle cleanup on shutdown
process.on('SIGINT', async () => {
    await rabbitMQService.closeConnection();
    process.exit(0);
});

startServer();
