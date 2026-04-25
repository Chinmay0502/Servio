import Task from "../models/task.model.js";
import { Service } from "../models/service.model.js";
import { generateOtpEmailOption, sendEmail } from "../lib/sendMail.js";

export const createTask = async (req, res) => {
  let task;
  try {
    const { serviceId, addressId, serviceDate, preferredTimes } = req.body;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
        success: false
      });
    }

    task = await Task.create({
      serviceId,
      userId: req.user.id,
      providerId: service.providerId,
      addressId,
      price: service.price,
      serviceDate,
      preferredTimes,
      status: "PENDING",
    });

    return res.status(201).json({
      message: "Service booked successfully",
      success: true,
      task,
    });

  } catch (error) {
    console.error("Error creating task: ", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const respondToTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { action } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found", success: false });
    }

    if (task.providerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized access", success: false });
    }

    if (task.status !== "PENDING") {
      return res.status(400).json({ message: "Task already responded", success: false });
    }

    if (action === "ACCEPT") {
      task.status = "ACCEPTED";
    } else if (action === "REJECT") {
      task.status = "REJECTED";
    } else {
      return res.status(400).json({ message: "Invalid action", success: false });
    }

    task.providerResponseAt = new Date();

    await task.save();

    return res.status(200).json({
      message: `Task ${action}ED successfully`,
      task,
      success: true
    });

  } catch (error) {
    console.error("Error responding task: ", error)
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const assignWorkers = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { workerIds } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found", success: false });
    }

    // Only provider can assign workers
    if (task.providerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized access", success: false });
    }

    if (task.status !== "ACCEPTED") {
      return res.status(400).json({ message: "Accept task first", success: false });
    }

    task.workers = workerIds;
    task.status = "WORKER_ASSIGNED";

    await task.save();

    return res.status(200).json({
      message: "Workers assigned successfully",
      task,
      success: true
    });

  } catch (error) {
    console.error("Error assigning workers to task: ", error)
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id })
      .populate("serviceId")
      .populate("providerId", "name email image")
      .populate("workers", "name image");

    return res.status(200).json({
      tasks,
      success: true,
      message: "Tasks fetched successfully"
    });

  } catch (error) {
    console.error("Error getting tasks: ", error)
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const getProviderTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ providerId: req.user.id })
      .populate("serviceId")
      .populate("userId", "name phone image")
      .populate("workers", "name image phone");

    return res.status(200).json({
      tasks,
      success: true,
      message: "Tasks fetched successfully"
    });

  } catch (error) {
    console.error("Error getting tasks: ", error)
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const getWorkerTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ workers: req.user.id })
      .populate("serviceId")
      .populate("userId", "name phone")
      .populate("addressId");

    return res.status(200).json({
      tasks,
      success: true,
      message: "Tasks fetched successfully"
    });

  } catch (error) {
    console.error("Error getting task: ", error)
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const generateOtp = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("userId", "email")
    .populate("serviceId", "name");

    if (!task) {
      return res.status(404).json({ message: "Task not found", success: false });
    }

    const isWorker = task.workers.some(
      (w) => w.toString() === req.user.id.toString()
    );

    if (!isWorker) {
      return res.status(403).json({ message: "Unauthorized access", success: false });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await Otp.create({
      taskId,
      otp,
      expiry,
    });

    const emailOptions = generateOtpEmailOption(
      task.userId.email,
      otp,
      service.name
    );

    await sendEmail(emailOptions);
    return res.status(200).json({
      message: "OTP generated",
      success: true,
      otp,
    });

  } catch (error) {
    console.error("Error generating OTP:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const startTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { otp } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found", success: false });
    }

    const isWorkerAssigned = task.workers.some(
      (worker) => worker.toString() === req.user.id.toString()
    );

    if (!isWorkerAssigned) {
      return res.status(403).json({ message: "Unauthorized access", success: false });
    }

    if (task.status !== "WORKER_ASSIGNED") {
      return res.status(400).json({ message: "Task cannot be started", success: false });
    }

    const validOtp = await Otp.findOne({
      taskId,
      otp,
      isUsed: false,
    });

    if (!validOtp) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    if (validOtp.expiry < new Date()) {
      return res.status(400).json({ message: "OTP expired", success: false });
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
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { otp } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found", success: false });
    }

    const isWorkerAssigned = task.workers.some(
      (worker) => worker.toString() === req.user.id.toString()
    );

    if (!isWorkerAssigned) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    if (task.status !== "STARTED") {
      return res.status(400).json({ message: "Task not started", success: false });
    }

    const validOtp = await Otp.findOne({
      taskId,
      otp,
      isUsed: false,
    });

    if (!validOtp || validOtp.expiry < new Date()) {
      return res.status(400).json({ message: "Invalid/Expired OTP", success: false });
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
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};