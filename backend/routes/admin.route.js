import express from "express";
import { addAdmin, adminLogin, adminLogout, changeCategoryStatus, changeServiceRole, changeUserStatus, getAllPendingProviderRequests } from "../controllers/admin.controller.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const adminRouter = express.Router();

adminRouter.post("/register", addAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.get("/logout", verifyToken, isAdmin, adminLogout);
adminRouter.get("/user-status/:userId", verifyToken, isAdmin, changeUserStatus);
adminRouter.put("/category-status/:categoryId", verifyToken, isAdmin, changeCategoryStatus);
adminRouter.get("/get-all-provider-requests", verifyToken, isAdmin, getAllPendingProviderRequests);
adminRouter.put("/service-provider-status/:requestId", verifyToken, isAdmin, changeServiceRole);

export default adminRouter;