import Sub from "../models/subscription.model.js";

const createSubscription = async (req, res) => {
    try {
        const { userId, planId } = req.body;

        if (!userId || !planId) {
            return res.status(400).json({ message: "User ID and Plan ID are required" });
        }

        const newSubscription = new Sub({
            userId,
            planId,
            status: "ACTIVE",
            startAt: new Date(),
        });

        await newSubscription.save();

        return res.status(201).json({
            message: "Subscription created successfully",
            subscription: newSubscription,
        });
    } catch (error) {
        console.error("Error creating subscription:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const getSubscription = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const subscription = await Sub.findOne({ userId }).populate("planId");

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        return res.status(200).json({
            message: "Subscription retrieved successfully",
            subscription,
        });
    } catch (error) {
        console.error("Error retrieving subscription:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const updateSubscription = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        if (!userId || !status) {
            return res.status(400).json({ message: "User ID and status are required" });
        }

        const subscription = await Sub.findOneAndUpdate(
            { userId },
            { status },
            { new: true }
        );

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        return res.status(200).json({
            message: "Subscription renewed successfully , but next payment will be charged",
            subscription,
        });
    } catch (error) {
        console.error("Error updating subscription:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const cancelSubscription = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const subscription = await Sub.findOneAndUpdate(
            { userId },
            { status: "CANCELED" },
            { new: true }
        );

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        return res.status(200).json({
            message: "Subscription canceled successfully",
            subscription,
        });
    } catch (error) {
        console.error("Error canceling subscription:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export  {
    createSubscription,
    getSubscription,
    updateSubscription,
    cancelSubscription
};

