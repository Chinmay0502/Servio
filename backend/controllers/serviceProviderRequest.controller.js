import User from "../models/user.model.js";
import ServiceProviderRequest from "../models/serviceProviderRequests.model.js";
import Category from "../models/category.model.js";
import {
  uploadToCloudinary
} from "../lib/uploadFile.js";
export const request = async (req, res) => {
  try {
    const {
      categoryId,
      subCategory
    } = req.body;
    const userId = req.user.id;

    const parsedSubCategory = JSON.parse(subCategory);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
    }

    if (user.role === "CONSUMER") {
      user.role = "SERVICE_PROVIDER";
      await user.save();
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }

    const existingRequest = await ServiceProviderRequest.findOne({
      providerId: userId,
      categoryId,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Already requested",
        success: false,
      });
    }

    const {
      low,
      high
    } = category.priceRange;
    if (parsedSubCategory.price < low || parsedSubCategory.price > high) {
      return res.status(400).json({
        message: `Price must be between ₹${low} and ₹${high}`,
        success: false,
      });
    }

    if (req.files && req.files.length > 0) {
      let uploadedImages = [];

      for (const file of req.files) {
        const uploadedImage = await uploadToCloudinary(file.path);

        if (uploadedImage) {
          uploadedImages.push({
            url: uploadedImage.url,
            public_id: uploadedImage.public_id,
          });
        }
      }

      parsedSubCategory.images = uploadedImages;
    }

    const newRequest = await ServiceProviderRequest.create({
      providerId: userId,
      categoryId,
      subCategory: parsedSubCategory,
    });

    res.status(201).json({
      message: "Successfully requested",
      success: true,
      request: newRequest,
    });
  } catch (error) {
    console.error("Error while requesting to become a service provider", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


export const getAllRequestStatus = async (req, res) => {
  try {

    const userId = req.user.id;

    const requests = await ServiceProviderRequest
      .find({
        providerId: userId
      })
      .populate("categoryId", "name description priceRange")
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      message: "Requests fetched successfully",
      success: true,
      requests
    });

  } catch (error) {
    console.error("Error checking status", error);

    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
}

export const cancelRequest = async (req, res) => {
  try {

    const {
      requestId
    } = req.params;
    const userId = req.user.id;

    const request = await ServiceProviderRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        success: false
      });
    }

    if (request.providerId.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false
      });
    }

    await ServiceProviderRequest.findByIdAndDelete(requestId);

    res.status(200).json({
      message: "Request cancelled successfully",
      success: true
    });

  } catch (error) {

    console.error("Error canceling request", error);

    res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};