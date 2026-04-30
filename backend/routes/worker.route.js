import express from "express";
import { addWorker, workerLogin, deleteWorker, getProviderWorkers } from "../controllers/worker.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const workerRouter = express.Router();

// Provider routes
workerRouter.post("/add", verifyToken, addWorker);
workerRouter.get("/provider-workers", verifyToken, getProviderWorkers);
workerRouter.delete("/delete/:workerId", verifyToken, deleteWorker);

// Worker login route
workerRouter.post("/login", workerLogin);

export default workerRouter;