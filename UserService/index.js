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

        // Example: Subscribe to user events
        await rabbitMQService.subscribeToUserEvents(
            'user-service-queue',
            async (message) => {
                console.log('Received user event:', message);
                // Handle the message here
            }
        );

        // Start server
        const port = process.env.PORT || 3001;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle cleanup on shutdown
process.on('SIGINT', async () => {
    await rabbitMQService.closeConnection();
    process.exit(0);
});

startServer();
