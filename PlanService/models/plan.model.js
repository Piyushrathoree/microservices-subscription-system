import mongoose, { Schema } from "mongoose";

const planSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: String, required: true },
    features: { type: [String], required: true },
    duration: { type: String, required: true }, // e.g., "monthly", "yearly"
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Plan = mongoose.model("Plan", planSchema);
export default Plan;
