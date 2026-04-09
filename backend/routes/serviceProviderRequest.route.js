import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { cancelRequest, getAllRequestStatus, request } from "../controllers/serviceProviderRequest.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
const serviceProviderRequestRouter = express.Router();

serviceProviderRequestRouter.post("/request", verifyToken, upload.array("images", 5), request);
serviceProviderRequestRouter.get("/get-all-requests", verifyToken, getAllRequestStatus);
serviceProviderRequestRouter.delete("/cancel-request/:requestId", verifyToken, cancelRequest);

export default serviceProviderRequestRouter;