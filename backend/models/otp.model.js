import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    otp: {
        type: Number,
        min: 1000,
        max: 9999,
        required: true
    },
    expiry : {
        type: Date,
        required: true,
    },
    isUsed: {
        type: Boolean,
        default: false
    },
}, {timestamps: true});

OtpSchema.index({ taskId: 1 });

const Otp = mongoose.model("Otp", OtpSchema);

export default Otp;