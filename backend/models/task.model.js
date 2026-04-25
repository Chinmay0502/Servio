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
    workers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    status: {
        type: String,
        enum: [
            "PENDING",              // user created request
            "ACCEPTED",             // provider accepted
            "REJECTED",             // provider rejected
            "WORKER_ASSIGNED",      // worker assigned
            "STARTED",              // worker started job
            "COMPLETED",            // finished
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
    preferredTimes: [
        {
            startTime: Date,
            endTime: Date
        }
    ],
    providerResponseAt: Date,

}, { timestamps: true });

const Task = mongoose.model("Task", TaskSchema);

export default Task;