import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    },
  }, ],
}, {
  _id: false
});


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
  },

  subCategory: subCategorySchema

}, {
  timestamps: true
});


serviceProviderRequestSchema.index({
  providerId: 1,
  categoryId: 1
}, {
  unique: true
});

const ServiceProviderRequest = mongoose.model(
  "ServiceProviderRequest",
  serviceProviderRequestSchema
);

export default ServiceProviderRequest;