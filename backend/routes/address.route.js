import {Router} from "express";

import {verifyToken} from "../middlewares/auth.middleware.js";
import { addAddress, deleteAddress, getAddressById, getAllAddresses, updateAddress } from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.get("/", verifyToken, getAllAddresses);
addressRouter.get("/:id", verifyToken, getAddressById);
addressRouter.post("/", verifyToken, addAddress);
addressRouter.put("/:id", verifyToken, updateAddress);
addressRouter.delete("/:id", verifyToken, deleteAddress);

export default addressRouter;