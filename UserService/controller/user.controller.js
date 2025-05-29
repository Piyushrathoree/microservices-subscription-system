import { User } from "../models/user.model.js";
import { generateHash, generateVerificationCode } from "../utils/utils.js";
import bcrypt from "bcryptjs";
import {
    sendForgotPasswordMail,
    sendRegisterMail,
    sendWelcomeBackMail,
} from "../mail/mail.js";
import crypto from "crypto";
const shareCode = generateHash();
const RegisterUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const verificationCode = generateVerificationCode();

        if (!verificationCode) {
            return res
                .status(500)
                .json({ message: "Failed to generate verification code" });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verificationCode,
            verificationTokenExpiresAt: Date.now() + 60 * 1000 * 10, // 10 minutes
            shareCode,
        });
        const token = newUser.generateAuthToken();
        if (!token) {
            return res.status(500).json({
                message: "Failed to generate authentication token",
            });
        }
        await newUser.save();

        const userData = await User.findById(newUser._id).select(
            "-password -verificationCode -verificationTokenExpiresAt"
        );
        //verificaiton email sending
        const data = await sendRegisterMail(email, verificationCode);
        if (data == null) {
            res.status(503).json({ message: "Email service unavailable" });
        }
        res.cookie("token", token);
        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: userData,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = user.generateAuthToken();

    user.lastLogin = new Date();
    user.isPublic = false;
    await user.save();
    await sendWelcomeBackMail(email, `${process.env.CLIENT_URL}/dashboard`);

    const userData = await User.findById(user._id).select(
        "-password -verificationCode -verificationCodeExpires -resetPasswordToken -resetPasswordTokenExpires"
    );
    if (!userData) {
        return res.status(404).json({ message: "User data not found" });
    }
    res.cookie("token", token);
    return res.status(200).json({
        message: "User logged in successfully",
        token,
        user: userData,
    });
};

const VerifyUser = async (req, res) => {
    const { verificationCode } = req.body;
    if (!verificationCode) {
        return res
            .status(400)
            .json({ message: "Verification code is required" });
    }
    try {
        const user = await User.findOne({ verificationCode });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "You're verified now" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const ForgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: "All fields are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }
        const resetPasswordToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordTokenExpires = new Date(resetPasswordTokenExpires);
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;
        await sendForgotPasswordMail(email, resetLink);

        return res.status(200).json({
            success: true,
            message: "password reset link has been sent to your email",
            resetPasswordToken,
        });
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "An unknown error occurred"
        );
    }
};

const ResetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                status: "error",
                message: "Password reset token is invalid or has expired",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;
        await user.save();

        res.status(200).json({
            status: "success",
            message: "Password has been reset",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error resetting password",
        });
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).send({ message: "All fields are required" });
    }
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid credentials" });
        }
        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
};

const LogoutUser = async (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
};

const getProfile = async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    RegisterUser,
    LoginUser,
    VerifyUser,
    ForgotPassword,
    ResetPassword,
    LogoutUser,
    changePassword,
    getProfile,
};
