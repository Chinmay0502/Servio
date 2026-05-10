import { Router } from "express";
import { isServiceProvider, verifyToken } from "../middlewares/auth.middleware.js";

import {
  assignWorkers,
  completeTask,
  createTask,
  getProviderTasks,
  getUserTasks,
  getWorkerTasks,
  respondToTask,
  startTask,
  generateOtp,
  getProviderTaskById,
  cancelTask,
  giveRatingAndFeedback,
  getProviderReviews,
  getServiceReviews
} from "../controllers/task.controller.js";
import { verifyWorkerToken } from "../middlewares/worker.middleware.js";

const taskRouter = Router();

// User
taskRouter.post("/", verifyToken, createTask);
taskRouter.get("/user", verifyToken, getUserTasks);
taskRouter.delete("/cancel/:taskId", verifyToken, cancelTask)

// Provider
taskRouter.patch("/:taskId/respond", verifyToken, isServiceProvider, respondToTask);
taskRouter.patch("/:taskId/assign", verifyToken, isServiceProvider, assignWorkers);
taskRouter.get("/provider", verifyToken, isServiceProvider, getProviderTasks);


// Worker
taskRouter.get("/worker", verifyWorkerToken, getWorkerTasks);
// taskRouter.get("/worker", verifyToken, isWorker, getWorkerTasks);
taskRouter.post("/:taskId/generate-otp", verifyWorkerToken, generateOtp);
taskRouter.patch("/:taskId/start", verifyWorkerToken, startTask);
taskRouter.patch("/:taskId/complete", verifyWorkerToken, completeTask);


taskRouter.patch("/:taskId/review", verifyToken,  giveRatingAndFeedback);
taskRouter.get("/provider/reviews", verifyToken,  isServiceProvider,  getProviderReviews);
taskRouter.get("/service/:serviceId/reviews", getServiceReviews);

import mongoose from "mongoose";

taskRouter.get(
  "/provider/:taskId",
  verifyToken,
  isServiceProvider,
  (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }
    next();
  },
  getProviderTaskById
);

export default taskRouter;