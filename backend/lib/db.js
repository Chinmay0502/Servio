import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

// Use Google's public DNS to resolve MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const db = () => {
    // console.log(process.env.MONGO_URI)
    mongoose.connect(process.env.MONGO_URI, {
        ssl: true,
        authSource: 'admin'
    })
        .then(() => console.log("Database Connected"))
        .catch(err => console.error("Failed to connect DB ", err));
}



export default db;