import { Router } from "express";
import { isServiceProvider, isWorker, verifyToken } from "../middlewares/auth.middleware.js";

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
  cancelTask
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
taskRouter.get("/provider/:taskId", verifyToken, isServiceProvider, getProviderTaskById);

// Worker
taskRouter.get("/worker", verifyWorkerToken, getWorkerTasks);
// taskRouter.get("/worker", verifyToken, isWorker, getWorkerTasks);
taskRouter.post("/:taskId/generate-otp", verifyToken, isWorker, generateOtp);
taskRouter.patch("/:taskId/start", verifyToken, isWorker, startTask);
taskRouter.patch("/:taskId/complete", verifyToken, isWorker, completeTask);

export default taskRouter;