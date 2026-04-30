import express from "express";
import { getAllServices, searchServices, getServiceById} from "../controllers/service.controller.js";

const router = express.Router();

router.get("/get-all-services", getAllServices);
router.get("/search", searchServices);
router.get("/get-service/:id", getServiceById);
export default router;