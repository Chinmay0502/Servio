import Category from "../models/category.model.js";
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";

export const createCategory = async (req, res) => {
    const { name, description, low, high } = req.body;

    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) return res.status(400).json({
            message: "Category already exist",
            success: false
        });
        const newCategory = await Category.create({ name, description, priceRange: { low, high } });
        if (!newCategory) return res.status(400).json({
            message: "Unable to create category",
            success: false
        })
        res.status(201).json({
            message: "Category created successfully",
            success: true,
            category: newCategory
        })
    } catch (error) {
        console.error("Error creating category: ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const updateCategory = async (req, res) => {
    const { name, description, low, high, isActive } = req.body;
    const { categoryId } = req.params;

    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        const category = await Category.findByIdAndUpdate(categoryId, { name, description, priceRange: { low, high }, isActive }, { new: true });
        if (!category) return res.status(404).json({
            message: "Category not found",
            success: false
        });
        res.status(200).json({
            message: "Category updated successfully",
            success: true,
            category
        })
    } catch (error) {
        console.error("Error updating category: ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const getAllCategories = async (req, res) => {
    try {

        const userId = req.user.id;

        const user = await User.findById(userId) || await Admin.findById(userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        const categories = await Category.find();

        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories
        });

    } catch (error) {
        console.error("Error getting all categories:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}