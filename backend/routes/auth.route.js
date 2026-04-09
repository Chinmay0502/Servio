import express from "express";
import {  userLogout, userLogin, userProfile, userRegister, userVerify, updateProfile, checkVerificationStatus} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const authRouter = express.Router();

authRouter.post("/user/register", userRegister);
authRouter.post("/user/login", userLogin);
authRouter.get("/user/verify/:token", userVerify);
authRouter.get("/user/logout", verifyToken, userLogout);
authRouter.get("/user/get-profile", verifyToken, userProfile);
authRouter.post("/user/update", verifyToken, upload.single("profileImage"), updateProfile);
authRouter.post("/user/check-verification", checkVerificationStatus);

export default authRouter;