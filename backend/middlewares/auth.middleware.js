import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if(!token) return res.status(400).json({
            message: "Invalid token",
            success: false
        });
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error verifying token: ", error);
        res.status(500).json({
            message: "Invalid token",
            success: false
        })
    }
}

export const isServiceProvider = async (req, res, next) => {
    try {
        if(req.user?.type !== "USER" || req.user?.role !== "SERVICE_PROVIDER") return res.status(403).json({
            message: "Unauthorized access",
            success: false
        })
        next();
    } catch (error) {
        console.error("Error checking role: ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const isWorker = async (req, res, next) => {
    try {
        if(req.user?.type !== "USER" || req.user?.role !== "WORKER") return res.status(403).json({
            message: "Unauthorized access",
            success: false
        })
        next();
    } catch (error) {
        console.error("Error checking role: ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        if(req.user?.type !== "ADMIN") return res.status(403).json({
            message: "Unauthorized access",
            success: false
        })
        next();      
    } catch (error) {
        console.error("Error checking role: ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}