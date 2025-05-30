import Plan from "../models/plan.model.js";


const createPlan = async (req, res) => {
    try {
        const { name, description, price, duration, features } = req.body;

        if (!name  || !price || !duration ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newPlan = new Plan({
            name,
            description: description || "",
            price,
            duration,
            features: features || []
        });

        await newPlan.save();

        return res.status(201).json({
            status: "success",
            message: "Plan created successfully",
            data: newPlan
        });
    } catch (error) {
        console.error("Error creating plan:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const retrieveAllPlan = async (_, res) => {
    try {
        const plans = await Plan.find();
        return res.status(200).json({
            status: "success",
            data: plans
        });
    } catch (error) {
        console.error("Error retrieving plans:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const deletePlan = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Plan ID is required" });
        }

        const plan = await Plan.findByIdAndDelete(id);

        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        return res.status(200).json({
            status: "success",
            message: "Plan deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting plan:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updatePlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;

        if (!id) {
            return res.status(400).json({ message: "plan not found" });
        }

        const updatedPlan = await Plan.findByIdAndUpdate(id, {
            name,
            description,
            price
        }, { new: true });

        if (!updatedPlan) {
            return res.status(404).json({ message: "Plan not found" });
        }

        return res.status(200).json({
            status: "success",
            message: "Plan updated successfully",
            data: updatedPlan
        });
    } catch (error) {
        console.error("Error updating plan:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export {
    createPlan,
    retrieveAllPlan,
    deletePlan,
    updatePlan
}