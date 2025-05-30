import cron from "node-cron";
import Sub from "../models/subscription.model.js";
import rabbitMQService from "./rabbit.js";

// Run daily at midnight
cron.schedule("0 0 * * *", async () => {
    try {
        const now = new Date();

        // Find expired subscriptions
        const expiredSubscriptions = await Sub.find({
            status: 'active',
            endDate: { $lt: now }
        });

        for (const subscription of expiredSubscriptions) {
            // Update subscription status
            subscription.status = 'expired';
            await subscription.save();

            // Publish subscription expired event
            await rabbitMQService.publishSubscriptionEvent('subscription.expired', {
                subscriptionId: subscription._id,
                userId: subscription.userId,
                planId: subscription.planId,
                expiredAt: now
            });
        }

        console.log(`Checked ${expiredSubscriptions.length} subscriptions for expiry`);
    } catch (err) {
        console.error("❌ Error while expiring subscriptions:", err.message);
    }
});
