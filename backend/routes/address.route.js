import {Router} from "express";

import {verifyToken} from "../middlewares/auth.middleware.js";
import { deleteAddress, getAddressById, getAllAddresses } from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.get("/", verifyToken, getAllAddresses);
addressRouter.get("/:id", verifyToken, getAddressById);
addressRouter.post("/", verifyToken);
addressRouter.put("/:id", verifyToken);
addressRouter.delete("/:id", verifyToken, deleteAddress);

export default addressRouter;