import { Router } from "express";
import authMiddleware from "../middleware/user.middleware.js";
import { ForgotPassword, getProfile, LoginUser, LogoutUser, RegisterUser, ResetPassword, VerifyUser } from "../controller/user.controller.js";
import { validate, schemas } from "../middleware/validate.js";

const router = Router();

// Public routes
router.post("/register", validate(schemas.register), RegisterUser);
router.post("/login", validate(schemas.login), LoginUser);
router.post("/verify", validate(schemas.verify), VerifyUser);
router.post("/forgot-password", validate(schemas.forgotPassword), ForgotPassword);
router.post("/reset-password/:token", validate(schemas.resetPassword), ResetPassword);

// Protected routes
router.post("/logout", authMiddleware, LogoutUser);
router.get("/profile", authMiddleware, getProfile);

export { router };
