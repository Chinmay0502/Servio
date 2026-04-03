import jwt from "jsonwebtoken";

import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import {
    generateUserStatusChangeOption,
    sendEmail
} from "../lib/sendMail.js";
import ServiceProviderRequest from "../models/serviceProviderRequests.model.js";
import { Service } from "../models/service.model.js";
export const addAdmin = async (req, res) => {
    const {
        userName,
        email,
        password
    } = req.body;
    try {
        const existingAdmin = await Admin.findOne({
            $or: [{
                email
            }, {
                userName
            }]
        });

        if (existingAdmin) return res.status(400).json({
            message: "Admin already exist",
            success: false
        });
        const admin = await Admin.create({
            userName,
            email,
            password
        });
        if (!admin) return res.status(400).json({
            message: "Failed to create admin",
            success: false
        })
        res.status(201).json({
            message: "Admin created successfully",
            success: true,
            admin: {
                id: admin._id,
                userName: admin.userName,
                email: admin.email
            }
        })
    } catch (error) {
        console.error("Error creating admin", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const adminLogin = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    try {
        const admin = await Admin.findOne({
            email
        });
        if (!admin) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        const isPasswordMatched = await admin.comparePassword(password);
        if (!isPasswordMatched) return res.status(401).json({
            message: "Invalid email or password",
            success: false
        })
        const token = await jwt.sign({
            id: admin._id,
            type: "ADMIN",
            role: "ADMIN"
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY
        });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            message: "Admin logged in",
            success: true,
            admin: {
                id: admin._id,
                userName: admin.userName,
                email: admin.email
            }
        })
    } catch (error) {
        console.error("Error logging in admin", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const adminLogout = async (req, res) => {
    try {
        const adminId = req.user.id;
        const admin = await Admin.findById(adminId);
        if (!admin) return res.status(401).json({
            message: "Admin Id not found",
            success: false
        })
        res.cookie("token", null, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 0
        })
        res.status(200).json({
            message: "Admin logged out",
            success: true
        })
    } catch (error) {
        console.error("Error logging out admin: ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const changeUserStatus = async (req, res) => {
    const {
        userId
    } = req.params;
    if (!userId) return res.status(400).json({
        message: "Invalid user Id",
        success: false
    })
    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({
            message: "Required user not found",
            success: false
        });
        user.status = user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
        await user.save();

        //send mail
        const options = generateUserStatusChangeOption(user.email, user.status);
        const isMailSent = await sendEmail(options);
        if (!isMailSent) return res.status(400).json({
            message: "Mail couldn't send",
            success: false
        })

        return res.status(200).json({
            message: "User status changed.",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                image: user.image
            }
        })
    } catch (error) {
        console.error("Error changing user status: ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const changeCategoryStatus = async (req, res) => {
    const {
        categoryId
    } = req.params;
    try {
        const adminId = req.user.id;
        const admin = await Admin.findById(adminId);
        if (!admin) return res.status(403).json({
            message: "Unauthorized access",
            success: false
        });
        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({
            message: "Reqiured category not found",
            success: false
        });
        category.isActive = !category.isActive;
        await category.save();
        res.status(200).json({
            message: "Category status changed",
            success: true
        })
    } catch (error) {
        console.error("Error changing status of the required category: ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const getAllPendingProviderRequests = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        });
        const pendingRequests = await ServiceProviderRequest
            .find({
                status: "PENDING"
            })
            .populate("providerId", "name email")
            .populate("categoryId", "name")
            .populate("subCategory", "name description price")
            .sort({
                createdAt: -1
            });
        if (!pendingRequests) return res.status(404).json({
            message: "No requests found",
            success: false
        });
        return res.status(200).json({
            message: "Successfully fetched pending requests",
            success: true,
            requests: pendingRequests
        })
    } catch (error) {
        console.error("Error fetching the pending requests", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const changeServiceRole = async (req, res) => {
  try {

    const { decision } = req.body;
    const { requestId } = req.params;

    // validate decision
    if (!["ACCEPT", "REJECT"].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Invalid decision"
      });
    }

    // check admin
    const adminId = req.user?.id;

    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    // find request
    const request = await ServiceProviderRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    // check request status
    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Request already processed"
      });
    }

    // ACCEPT LOGIC
    if (decision === "ACCEPT") {

      // update user role
      await User.findByIdAndUpdate(request.providerId, {
        role: "SERVICE_PROVIDER"
      });

      // create service entry
      await Service.create({
        providerId: request.providerId,
        categoryId: request.categoryId,
        name: request.subCategory.name,
        description: request.subCategory.description,
        price: request.subCategory.price
      });

      request.status = "ACCEPTED";
    }

    // REJECT LOGIC
    if (decision === "REJECT") {
      request.status = "REJECTED";
    }

    await request.save();

    return res.status(200).json({
      success: true,
      message: `Request ${request.status.toLowerCase()} successfully`,
      request
    });

  } catch (error) {

    console.error("Error updating request:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};