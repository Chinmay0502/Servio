import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },

  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true
  },

  price: {
    type: Number,
    required: true,
    default: 0
  },

  workers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
  }, ],

  status: {
    type: String,
    enum: [
      "PENDING",
      "ACCEPTED",
      "REJECTED",
      "WORKER_ASSIGNED",
      "STARTED",
      "COMPLETED",
      "CANCELLED"
    ],
    default: "PENDING",
  },

  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  feedback: {
    type: String,
    trim: true
  },

  serviceDate: {
    type: Date,
    required: true,
  },

  preferredTime: {
    type: String,
    required: true,
    trim: true
  },
  
  providerResponseAt: Date,

}, {
  timestamps: true
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;