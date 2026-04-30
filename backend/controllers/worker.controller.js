import Worker from "../models/worker.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ========================== ADD WORKER (Provider) ==========================
export const addWorker = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, Email and Password are required",
        success: false,
      });
    }

    const existingWorker = await Worker.findOne({ email });

    if (existingWorker) {
      return res.status(400).json({
        message: "Worker already exists with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const worker = await Worker.create({
      providerId: req.user.id, // provider logged in
      name,
      email,
      phone,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Worker added successfully",
      success: true,
      worker,
    });
  } catch (error) {
    console.error("Error adding worker:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ========================== WORKER LOGIN ==========================
export const workerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const worker = await Worker.findOne({ email });

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, worker.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: worker._id, role: "WORKER" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }).status(200).json({
      message: "Worker login successful",
      success: true,
      worker: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        providerId: worker.providerId,
      },
      token,
    });

  } catch (error) {
    console.error("Error worker login:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ========================== GET PROVIDER WORKERS ==========================
export const getProviderWorkers = async (req, res) => {
  try {
    const workers = await Worker.find({ providerId: req.user.id }).select("-password");

    return res.status(200).json({
      message: "Workers fetched successfully",
      success: true,
      workers,
    });
  } catch (error) {
    console.error("Error fetching workers:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ========================== DELETE WORKER (Provider) ==========================
export const deleteWorker = async (req, res) => {
  try {
    const { workerId } = req.params;

    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({
        message: "Worker not found",
        success: false,
      });
    }

    // ✅ Only provider who created worker can delete
    if (worker.providerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized access",
        success: false,
      });
    }

    await Worker.findByIdAndDelete(workerId);

    return res.status(200).json({
      message: "Worker deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting worker:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};