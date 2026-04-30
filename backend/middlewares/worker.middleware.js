import jwt from "jsonwebtoken";
import Worker from "../models/worker.model.js";

export const verifyWorkerToken = async (req, res, next) => {
  try {
    // token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check role
    if (decoded.role !== "WORKER") {
      return res.status(403).json({
        message: "Unauthorized access",
        success: false,
      });
    }

    // check worker exists
    const worker = await Worker.findById(decoded.id);

    if (!worker) {
      return res.status(401).json({
        message: "Worker not found",
        success: false,
      });
    }

    // attach worker info
    req.user = {
      id: worker._id,
      role: worker.role,
      providerId: worker.providerId,
    };

    next();
  } catch (error) {
    console.error("Error verifying worker token:", error);

    return res.status(401).json({
      message: "Invalid token",
      success: false,
    });
  }
};