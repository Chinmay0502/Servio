import { Service } from "../models/service.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";

export const getAllServices = async (req, res) => {
  try {

    const services = await Service.find()
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