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

        // Subscribe to user events
        await rabbitMQService.subscribeToUserEvents(
            'subscription-service-user-events',
            async (message) => {
                console.log('Received user event:', message);
                // Handle user events (e.g., user deletion)
            }
        );

        // Subscribe to plan events
        await rabbitMQService.subscribeToPlanEvents(
            'subscription-service-plan-events',
            async (message) => {
                console.log('Received plan event:', message);
                // Handle plan events (e.g., plan updates/deletions)
            }
        );

        // Start server
        const port = process.env.PORT || 3003;
        app.listen(port, () => {
            console.log(`Subscription Service running on port ${port}`);
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
