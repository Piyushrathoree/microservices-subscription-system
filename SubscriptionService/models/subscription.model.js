import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User", // refers to User Service
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            // refers to Plan Service
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE", "CANCELLED", "EXPIRED"],
            default: "ACTIVE",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

const Sub = mongoose.model("Sub", subscriptionSchema);
export default Sub;
