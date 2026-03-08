import express from "express";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import { createCategory, getAllCategories, updateCategory } from "../controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.post("/create", verifyToken, isAdmin, createCategory);
categoryRouter.put("/update/:categoryId", verifyToken, isAdmin, updateCategory);
categoryRouter.get("/get-all-categories", verifyToken, getAllCategories);

export default categoryRouter;