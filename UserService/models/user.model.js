import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        verificationCode: String,
        verificationTokenExpiresAt: Date,
        isVerified: { type: Boolean, default: false },
        resetPasswordToken: String,
        resetPasswordTokenExpires: Date,
        lastLogin: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "10d",
    });
};

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

export const User = model("User", userSchema);
