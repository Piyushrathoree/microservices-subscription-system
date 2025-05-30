import Sub from "../models/subscription.model.js";
import jwt from "jsonwebtoken";
import rabbitMQService from "../service/rabbit.js";

const createSubscription = async (req, res) => {
    try {
        const { userId, planId } = req.body; // it will eventually come from the params redirected by frontend

        if (!userId || !planId) {
            return res
                .status(400)
                .json({ message: "User ID and Plan ID are required" });
        }

        const newSubscription = new Sub({
            userId,
            planId,
            status: "ACTIVE",
            startDate: new Date(),
        });
        console.log("Creating new subscription:", newSubscription);
        await newSubscription.save();

        // Publish subscription created event
        await rabbitMQService.publishSubscriptionEvent("subscription.created", {
            subscriptionId: newSubscription._id,
            userId: newSubscription.userId,
            planId: newSubscription.planId,
            startDate: newSubscription.startDate,
            status: newSubscription.status,
        });

        return res.status(200).json({
            message: "Subscription created successfully",
            subscription: newSubscription,
        });
    } catch (error) {
        console.error("Error creating subscription:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const getSubscription = async (req, res) => {
    try {
        const token =
            req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const subscription = await Sub.find({ userId }).populate("planId");

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
};
const updateSubscription = async (req, res) => {
    try {
        const { subId } = req.params;
        let { status } = req.body;

        if (!subId || !status) {
            return res
                .status(400)
                .json({ message: "Subscription ID and status are required" });
        }
        status = status.toUpperCase();
        const subscription = await Sub.findOneAndUpdate(
            { _id: subId },
            { status },
            { new: true }
        );

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        return res.status(200).json({
            message:
                "Subscription renewed successfully , but next payment will be charged",
            subscription,
        });
    } catch (error) {
        console.error("Error updating subscription:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const cancelSubscription = async (req, res) => {
    try {
        const { subId } = req.params;

        if (!subId) {
            return res
                .status(400)
                .json({ message: "Subscription ID is required" });
        }

        const subscription = await Sub.findOneAndUpdate(
            { _id: subId },
            { status: "CANCELED" },
            { new: true }
        );

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        // Publish subscription cancelled event
        await rabbitMQService.publishSubscriptionEvent(
            "subscription.cancelled",
            {
                subscriptionId: subscription._id,
                userId: subscription.userId,
                planId: subscription.planId,
                cancelledAt: subscription.cancelledAt,
            }
        );

        return res.status(200).json({
            message: "Subscription canceled successfully",
            subscription,
        });
    } catch (error) {
        console.error("Error canceling subscription:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export {
    createSubscription,
    getSubscription,
    updateSubscription,
    cancelSubscription,
};
