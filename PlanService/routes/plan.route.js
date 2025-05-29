import { Router } from "express";
const router = Router();
import { createPlan, deletePlan, retrieveAllPlan, updatePlan } from "../controller/plan.controller.js";

router.post("/", createPlan);
router.get("/", retrieveAllPlan);
router.put("/:id", updatePlan);
router.delete("/:id", deletePlan);

export { router}
