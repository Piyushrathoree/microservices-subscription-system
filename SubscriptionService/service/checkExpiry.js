import cron from "node-cron";
import Sub from "../models/subscription.model.js";

// Run daily at midnight
cron.schedule("* * * * *", async () => {
    try {
        const now = new Date();

        const result = await Sub.updateMany(
            { endDate: { $lt: now }, status: "ACTIVE" },
            { $set: { status: "EXPIRED" } }
        );
        console.log(`✅ Subscriptions expired: ${result.modifiedCount}`);
    } catch (err) {
        console.error("❌ Error while expiring subscriptions:", err.message);
    }
});
