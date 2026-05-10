import express from "express";
import { getAllServices, searchServices, getServiceById, getMyServices, toggleServiceStatus, updateService} from "../controllers/service.controller.js";
import { isServiceProvider, verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get-all-services", getAllServices);
router.get("/search", searchServices);
router.get("/get-service/:id", getServiceById);
router.get("/my-services", verifyToken, isServiceProvider, getMyServices);
router.put(
  "/toggle-status/:serviceId",
  verifyToken,
  isServiceProvider,
  toggleServiceStatus
);
router.put("/:serviceId", verifyToken, isServiceProvider, updateService);
export default router;