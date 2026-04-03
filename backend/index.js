import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import db from "./lib/db.js";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import serviceProviderRequestRouter from "./routes/serviceProviderRequest.route.js";
import categoryRouter from "./routes/category.route.js";
import serviceRoutes from "./routes/service.route.js";


dotenv.config();

const app = express();
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cors({
    origin: ["http://localhost:5173", process.env.BASE_URL],
    methods: ['GET', 'PUT', 'POST', "DELETE", "PATCH"],
    credentials: true,
    allowedHeader: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());

const PORT = process.env.PORT;

db();

app.get("/", (req, res) => {
    res.send("Hello from Servio ✨");
})

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/category", categoryRouter);
app.use("/api/service-provider", serviceProviderRequestRouter);
app.use("/api/services", serviceRoutes);

app.listen(PORT, () => console.log(`Server is runnig at port: ${PORT}`));