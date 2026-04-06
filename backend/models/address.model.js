import { Schema, model } from "mongoose";

const addressSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    houseNo: {
        type: String,
        required: true,
        trim: true
    },
    street: {
        type: String,
        required: true,
        trim: true
    },
    landmark: {
        type: String,
        trim: true
    },
    area: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    // Address type
    addressType: {
        type: String,
        enum: ["home", "work", "other"],
        default: "home"
    },
    // Default address
    isDefault: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

// Geo Index for nearby search
addressSchema.index({ location: "2dsphere" });

const Address = model("Address", addressSchema);

export default Address;