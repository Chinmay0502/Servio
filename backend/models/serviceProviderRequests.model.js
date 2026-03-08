import mongoose from "mongoose";

const serviceProviderRequestSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED"],
        default: "PENDING"
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    } 
}, {timestamps: true});

serviceProviderRequestSchema.index(
  { providerId: 1, categoryId: 1 },
  { unique: true }
);

const ServiceProviderRequest = mongoose.model("ServiceProviderRequest", serviceProviderRequestSchema);

export default ServiceProviderRequest;