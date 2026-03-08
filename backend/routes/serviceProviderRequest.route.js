import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { cancelRequest, getAllRequestStatus, request } from "../controllers/serviceProviderRequest.controller.js";

const serviceProviderRequestRouter = express.Router();

serviceProviderRequestRouter.post("/request", verifyToken, request);
serviceProviderRequestRouter.get("/get-all-requests", verifyToken, getAllRequestStatus);
serviceProviderRequestRouter.delete("/cancel-request/:requestId", verifyToken, cancelRequest);

export default serviceProviderRequestRouter;