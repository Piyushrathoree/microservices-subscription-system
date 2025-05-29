import { Router } from "express";
import {
    cancelSubscription,
    createSubscription,
    getSubscription,
    updateSubscription,
} from "../controller/subscription.controller.js";
import authMiddleware from "../middleware/Auth.middleware.js";
const router = Router();

router.use(authMiddleware);
router.post("/", createSubscription);
router.get("/", getSubscription);
router.put("/:id", updateSubscription);
router.delete("/:id", cancelSubscription);

export { router };
