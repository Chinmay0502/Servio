import express from "express";
import { getAllServices } from "../controllers/service.controller.js";

const router = express.Router();

router.get("/get-all-services", getAllServices);

export default router;