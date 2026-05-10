import Task from "../models/task.model.js";
import { Service } from "../models/service.model.js";
import mongoose from "mongoose";
import { generateOtpEmailOption, sendEmail } from "../lib/sendMail.js";
import Otp from "../models/otp.model.js";

export const createTask = async (req, res) => {
  try {
    const { serviceId, addressId, serviceDate, preferredTime } = req.body;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
        success: false,
      });
    }

    const price = service.price || 0;

    const task = await Task.create({
      serviceId,
      userId: req.user.id,
      providerId: service.providerId,
      addressId,
      price,
      serviceDate,
      preferredTime, 
      status: "PENDING",
    });

    return res.status(201).json({
      message: "Service booked successfully",
      success: true,
      task,
    });
  } catch (error) {
    console.error("Error creating task: ", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const cancelTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    if (!task.userId || task.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access",
        success: false,
      });
    }
    if (task.status === "STARTED" || task.status === "COMPLETED") {
      return res.status(400).json({
        message: "Task cannot be cancelled now",
        success: false,
      });
    }
    await Task.findByIdAndDelete(taskId);

    return res.status(200).json({
      message: "Task cancelled and deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error cancelling task:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


export const respondToTask = async (req, res) => {
  try {
    const {
      taskId
    } = req.params;
    const {
      action
    } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false
      });
    }

    if (!task.providerId || task.providerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access",
        success: false
      });
    }

    if (task.status !== "PENDING") {
      return res.status(400).json({
        message: "Task already responded",
        success: false
      });
    }

    if (action === "ACCEPT") {
      task.status = "ACCEPTED";
    } else if (action === "REJECT") {
      task.status = "REJECTED";
    } else {
      return res.status(400).json({
        message: "Invalid action",
        success: false
      });
    }

    task.providerResponseAt = new Date();
    await task.save();

    return res.status(200).json({
      message: `Task ${action}ED successfully`,
      task,
      success: true,
    });
  } catch (error) {
    console.error("Error responding task: ", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

import Worker from "../models/worker.model.js";

export const assignWorkers = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { workerIds } = req.body;

    if (!workerIds || workerIds.length === 0) {
      return res.status(400).json({
        message: "Please select at least one worker",
        success: false,
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    if (!task.providerId || task.providerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access",
        success: false,
      });
    }

    if (task.status !== "ACCEPTED") {
      return res.status(400).json({
        message: "Accept task first",
        success: false,
      });
    }

    const validWorkers = await Worker.find({
      _id: { $in: workerIds },
      providerId: req.user.id,
    });

    if (validWorkers.length !== workerIds.length) {
      return res.status(400).json({
        message: "Some workers do not belong to you",
        success: false,
      });
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      task.workers = workerIds;
      task.status = "WORKER_ASSIGNED";
      await task.save({ session });

      await Worker.updateMany(
        { _id: { $in: workerIds } },
        { $addToSet: { taskIds: taskId } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: "Workers assigned successfully",
        task,
        success: true,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error assigning workers to task: ", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
        userId: req.user.id
      })
      .populate("serviceId")
      .populate("providerId", "name email image")
      .populate("workers", "name image")
      .populate("addressId");

    return res.status(200).json({
      tasks,
      success: true,
      message: "Tasks fetched successfully",
    });
  } catch (error) {
    console.error("Error getting tasks: ", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getProviderTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
        providerId: req.user.id
      })
      .populate("serviceId")
      .populate("userId", "name phone image")
      .populate("workers", "name image phone email")
      .populate("addressId"); // ✅ optional but useful

    return res.status(200).json({
      tasks,
      success: true,
      message: "Tasks fetched successfully",
    });
  } catch (error) {
    console.error("Error getting tasks: ", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

export const getWorkerTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
        workers: req.user.id
      })
      .populate("serviceId")
      .populate("userId", "name phone")
      .populate("addressId");

    return res.status(200).json({
      tasks,
      success: true,
      message: "Tasks fetched successfully",
    });
  } catch (error) {
    console.error("Error getting task: ", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};


export const getProviderTaskById = async (req, res) => {
  try {
    const {
      taskId
    } = req.params;

    const task = await Task.findById(taskId)
      .populate("serviceId")
      .populate("userId", "name phone image")
      .populate("workers", "name image phone")
      .populate("addressId");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false,
      });
    }

    if (!task.providerId || task.providerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access",
        success: false,
      });
    }

    return res.status(200).json({
      task,
      success: true,
      message: "Task fetched successfully",
    });
  } catch (error) {
    console.error("Error getting provider task by id: ", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const generateOtp = async (req, res) => {
  try {
    const {
      taskId
    } = req.params;

    const task = await Task.findById(taskId)
      .populate("userId", "email")
      .populate("serviceId", "name");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false
      });
    }

    const isWorker = task.workers.some(
      (w) => w.toString() === req.user.id.toString()
    );

    if (!isWorker) {
      return res.status(403).json({
        message: "Unauthorized access",
        success: false
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      taskId,
      otp,
      expiry,
    });

    if (!task.userId || !task.userId.email) {
      return res.status(400).json({
        message: "User email not found for this task",
        success: false
      });
    }

    const emailOptions = generateOtpEmailOption(
      task.userId.email,
      otp,
      task.serviceId?.name || "Service",
    );

    await sendEmail(emailOptions);

    return res.status(200).json({
      message: "OTP generated",
      success: true,
      otp,
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};


export const startTask = async (req, res) => {
  try {
    const {
      taskId
    } = req.params;
    const {
      otp
    } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false
      });
    }

    const isWorkerAssigned = task.workers.some(
      (worker) => worker.toString() === req.user.id.toString()
    );

    if (!isWorkerAssigned) {
      return res.status(403).json({
        message: "Unauthorized access",
        success: false
      });
    }

    if (task.status !== "WORKER_ASSIGNED") {
      return res.status(400).json({
        message: "Task cannot be started",
        success: false
      });
    }

    const validOtp = await Otp.findOne({
      taskId,
      otp,
      isUsed: false,
    });

    if (!validOtp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false
      });
    }

    if (validOtp.expiry < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
        success: false
      });
    }

    validOtp.isUsed = true;
    await validOtp.save();

    task.status = "STARTED";
    await task.save();

    return res.status(200).json({
      message: "Task started successfully",
      success: true,
      task,
    });
  } catch (error) {
    console.error("Error starting task:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

export const completeTask = async (req, res) => {
  try {
    const {
      taskId
    } = req.params;
    const {
      otp
    } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        success: false
      });
    }

    const isWorkerAssigned = task.workers.some(
      (worker) => worker.toString() === req.user.id.toString()
    );

    if (!isWorkerAssigned) {
      return res.status(403).json({
        message: "Unauthorized",
        success: false
      });
    }

    if (task.status !== "STARTED") {
      return res.status(400).json({
        message: "Task not started",
        success: false
      });
    }

    const validOtp = await Otp.findOne({
      taskId,
      otp,
      isUsed: false,
    });

    if (!validOtp) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false
      });
    }

    if (validOtp.expiry < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
        success: false
      });
    }

    validOtp.isUsed = true;
    await validOtp.save();

    task.status = "COMPLETED";
    await task.save();

    return res.status(200).json({
      message: "Task completed successfully",
      success: true,
      task,
    });
  } catch (error) {
    console.error("Error completing task:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

export const giveRatingAndFeedback = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const { rating, feedback } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found", success: false });
    }

    if (task.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    if (task.status !== "COMPLETED") {
      return res.status(400).json({
        message: "You can only review after task completion",
        success: false
      });
    }


    if (task.rating) {
      return res.status(400).json({
        message: "You have already reviewed this task",
        success: false
      });
    }

    task.rating = rating;
    task.feedback = feedback;

    await task.save();

    res.status(200).json({
      message: "Rating & feedback submitted successfully",
      task,
      success: true
    });
  } catch (error) {
    console.log("Rating error:", error.message);
    res.status(500).json({ message: "Internal Server error", success: false });
  }
};

export const getProviderReviews = async (req, res) => {
  try {
    const providerId = req.user.id;

    const tasks = await Task.find({
      providerId,
      status: "COMPLETED",
      rating: { $exists: true },
    })
      .populate("userId", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews: tasks, success: true, message: "Reviews fetched successfully" });
  } catch (error) {
    console.log("Fetch reviews error:", error.message);
    res.status(500).json({ message: "Internal Server error", success: false });
  }
};

export const getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const reviews = await Task.find({
      serviceId,
      status: "COMPLETED",
      rating: { $exists: true, $ne: null },
    })
      .populate("userId", "name image")
      .select("rating feedback createdAt userId")
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews, success: true, message: "Service reviews fetched successfully" });
  } catch (error) {
    console.log("Fetch service reviews error:", error.message);
    res.status(500).json({ message: "Internal Server error", success: false });
  }
};

export const getAllServiceAverageRatings = async (req, res) => {
  try {
    const ratings = await Task.aggregate([
      {
        $match: {
          status: "COMPLETED",
          rating: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$serviceId", // group by serviceId
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      ratings,
      message: "Average ratings fetched successfully",
    });
  } catch (error) {
    console.log("Fetch average ratings error:", error.message);
    res.status(500).json({
      message: "Internal Server error",
      success: false,
    });
  }
};