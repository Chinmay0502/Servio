import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'PUT', 'POST', "DELETE", "UPDATE"],
    credentials: true,
    allowedHeader: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Hello from Servio ✨");
})

app.listen(PORT, () => console.log(`Server is runnig at port: ${PORT}`));