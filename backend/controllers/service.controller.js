import { Service } from "../models/service.model.js";

export const getAllServices = async (req, res) => {
  try {

    const services = await Service.find()
      .populate("providerId", "name email")
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