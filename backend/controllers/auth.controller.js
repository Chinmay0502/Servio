import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/user.model.js";
import { generateVerifyEmailOption, sendEmail } from "../lib/sendMail.js";
import { uploadToCloudinary } from "../lib/uploadFile.js";
import cloudinary from "../lib/cloudinary.js";


export const userRegister = async (req, res) => {
    const { name, email, password, phone, aadhaarNo, gender } = req.body;
    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
        const newUser = await User.create({ name, email, password, phone, aadhaarNo, gender: gender.toUpperCase(),verificationToken, verificationTokenExpiry });
        if (!newUser) return res.status(400).json({
            message: "User couldn't created",
            success: false
        })

        //send mail
        const options = generateVerifyEmailOption(email, verificationToken);
        const isMailSent = await sendEmail(options);
        if (!isMailSent) return res.status(400).json({
            message: "Mail couldn't be sent",
            success: false
        })

        return res.status(201).json({
            message: "User created successfully. Now verify the email",
            success: true,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                status: newUser.status,
                image: newUser.image.url,
                gender: newUser.gender
            }
        })
    } catch (error) {
        console.error("Error creating user", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const userVerify = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({
            verificationToken: token, verificationTokenExpiry: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({
            message: "Invalid token",
            success: false
        })
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        return res.status(200).json({
            message: "User verified successfully",
            success: true
        })
    } catch (error) {
        console.error("Error verifying user: ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({
            message: "No user found",
            success: false
        });
        if (user.status === "BLOCKED") return res.status(401).json({
            message: "User profile blocked",
            success: false
        })
        if (!user.isVerified) return res.status(401).json({
            message: "User is not verified",
            success: false
        });
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) return res.status(400).json({
            message: "Invalid email or password",
            success: false
        });
        const token = await jwt.sign({ id: user._id, role: user.role, type: "USER" }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            message: "User logged in",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                image: user.image.url,
                gender: user.gender
            }
        })
    } catch (error) {
        console.error("Failed to login: ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const userLogout = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({
            message: "User not found",
            success: false
        })
        res.cookie("token", null, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 0
        })
        res.status(200).json({
            message: "User logged out",
            success: true
        })
    } catch (error) {
        console.error("Error logging out user: ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const userProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({
            message: "User not found",
            success: false
        });
        return res.status(200).json({
            message: "User fetched successfully",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                image: user.image.url,
                gender: user.gender,
                aadhaarNo: user.aadhaarNo
            }
        });
    } catch (error) {
        console.error("Error getting user profile: ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized access",
                success: false
            });
        }

        const { name, phone, aadhaarNo, gender } = req.body;

        if (req.file) {
            const uploadedImage = await uploadToCloudinary(req.file.path);

            if (uploadedImage) {
                // 🔥 Delete old image (if exists)
                if (user.image?.public_id) {
                    await cloudinary.uploader.destroy(user.image.public_id);
                }

                user.image = {
                    url: uploadedImage.url,
                    public_id: uploadedImage.public_id
                };
            }
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (aadhaarNo) user.aadhaarNo = aadhaarNo;
        if (gender) user.gender = gender;

        await user.save();

        res.status(200).json({
            message: "User profile updated",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                image: user.image.url,
                gender: user.gender,
                aadhaarNo: user.aadhaarNo
            }
        });

    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};