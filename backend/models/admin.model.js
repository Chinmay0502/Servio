import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    }
}, {timestamps: true});

adminSchema.pre("save", async function () {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;