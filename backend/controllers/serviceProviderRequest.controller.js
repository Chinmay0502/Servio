import User from "../models/user.model.js";
import ServiceProviderRequest from "../models/serviceProviderRequests.model.js";
import Category from "../models/category.model.js";

export const request = async (req, res) => {
    try {
        const { categoryId } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        if (user.role === "SERVICE_PROVIDER") return res.status(400).json({
            message: "User is already a service provider",
            success: false
        });
        const existingRequest = await ServiceProviderRequest.findOne({ providerId: userId, categoryId });
        if (existingRequest) return res.status(400).json({
            message: "Already requested",
            success: false
        });
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                success: false
            })
        }
        const newRequest = await ServiceProviderRequest.create({ providerId: userId, categoryId });
        return res.status(201).json({
            message: "Successfully requested",
            request: newRequest
        })
    } catch (error) {
        console.error("Error while requesting to become a service provider", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const getAllRequestStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        const requests = await ServiceProviderRequest
        .find({ providerId: userId })
        .populate("categoryId", "name description")
        .sort({createdAt: -1});
        if (!requests) return res.status(404).json({
            message: "No request found",
            success: false
        });
        res.status(200).json({
            message: "Requests fetched successfully",
            success: true,
            requests
        })
    } catch (error) {
        console.error("Error checking status", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const cancelRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        const request = await ServiceProviderRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({
                message: "Request not found",
                success: false
            })
        }

        if (request.providerId.toString() !== userId) {
            return res.status(403).json({
                message: "Unauthorized",
                success: false
            })
        }

        await ServiceProviderRequest.findByIdAndDelete(requestId);
        res.status(200).json({
            message: "Request cancelled successfully",
            success: true
        })
    } catch (error) {
        console.error("Error canceling request", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}