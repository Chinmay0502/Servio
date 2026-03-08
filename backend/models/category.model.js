import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: String,
    isActive: {
        type: Boolean,
        default: true
    },
    priceRange: {
        low: {
            type: Number,
            required: true,
        },
        high: {
            type: Number,
            required: true
        }
    }
}, {timestamps:true});

const Category = mongoose.model("Category", categorySchema);

export default Category;