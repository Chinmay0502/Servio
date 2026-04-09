import express from "express";
import { getAllServices, searchServices } from "../controllers/service.controller.js";

const router = express.Router();

router.get("/get-all-services", getAllServices);
router.get("/search", searchServices);

export default router;