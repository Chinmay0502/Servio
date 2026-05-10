import { Service } from "../models/service.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";

export const getAllServices = async (req, res) => {
  try {

    const services = await Service.find({ isActive: true })
      .populate("providerId", "name email image")
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      services
    });

  } catch (error) {

    console.error("Error fetching services:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};


export const searchServices = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const keyword = q.trim();

    // 🔍 Find matching categories
    const categories = await Category.find({
      name: { $regex: keyword, $options: "i" },
      isActive: true,
    });

    const categoryIds = categories.map((c) => c._id);

    // 🔍 Find matching providers
    const providers = await User.find({
      name: { $regex: keyword, $options: "i" },
      role: "SERVICE_PROVIDER",
    }).select("name image");

    const providerIds = providers.map((p) => p._id);

    // 🔍 Find services
    const services = await Service.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { categoryId: { $in: categoryIds } },
        { providerId: { $in: providerIds } },
      ],
    })
      .populate("categoryId", "name")
      .populate("providerId", "name image")
      .sort({ createdAt: -1 });

    // 🎯 UI-friendly filters
    const uniqueCategories = [
      ...new Map(
        services.map((s) => [s.categoryId?._id, s.categoryId])
      ).values(),
    ];

    const priceRange = {
      min: Math.min(...services.map((s) => s.price || 0)),
      max: Math.max(...services.map((s) => s.price || 0)),
    };

    return res.status(200).json({
      success: true,
      query: keyword,
      totalResults: services.length,
      filters: {
        categories: uniqueCategories,
        priceRange,
      },
      services,
    });
  } catch (error) {
    console.error("Search Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while searching services",
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id)
      .populate("providerId", "name email image phone address")
      .populate("categoryId", "name");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Error fetching service details:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMyServices = async (req, res) => {
  try {
    const providerId = req.user.id || req.user._id;

    console.log("ProviderId From Token:", providerId);

    const services = await Service.find({ providerId })
      .populate("providerId", "name email image")
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      services,
      message: "My services fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching my services:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const toggleServiceStatus = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const providerId = req.user.id || req.user._id;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // only owner can update
    if (service.providerId.toString() !== providerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // toggle
    service.isActive = !service.isActive;
    await service.save();

    return res.status(200).json({
      success: true,
      message: `Service is now ${service.isActive ? "Active" : "Inactive"}`,
      service,
    });
  } catch (error) {
    console.error("Toggle service status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const providerId = req.user.id || req.user._id;

    const {
      name,
      description,
      price,
      categoryId,
      image,
      isActive
    } = req.body;

    // 1. Find service
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // 2. Authorization check (only owner can edit)
    if (service.providerId.toString() !== providerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // 3. Optional: validate category if provided
    if (categoryId) {
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid category selected",
        });
      }
    }

    // 4. Update only provided fields (partial update support)
    if (name !== undefined) service.name = name;
    if (description !== undefined) service.description = description;
    if (price !== undefined) service.price = price;
    if (categoryId !== undefined) service.categoryId = categoryId;
    if (image !== undefined) service.image = image;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();

    // 5. Return updated service with population
    const updatedService = await Service.findById(service._id)
      .populate("providerId", "name email image")
      .populate("categoryId", "name");

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service: updatedService,
    });

  } catch (error) {
    console.error("Update service error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};