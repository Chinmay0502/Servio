import express from "express";
import {  userLogout, userLogin, userProfile, userRegister, userVerify} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/user/register", userRegister);
authRouter.post("/user/login", userLogin);
authRouter.get("/user/verify/:token", userVerify);
authRouter.get("/user/logout", verifyToken, userLogout);
authRouter.get("/user/get-profile", verifyToken, userProfile);

export default authRouter;