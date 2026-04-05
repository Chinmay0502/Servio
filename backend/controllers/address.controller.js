import Address from "../models/address.model.js";
import User from "../models/user.model.js";

export const addAddress = async (req, res) => {
    try{
        const user = await User.findById(req.user.id);
        if(!user) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })


    } catch (error){
        console.error("Error creating address ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const getAllAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        const addresses = await Address.find({userId: user.id});
        if(!addresses) return res.satus(404).jaon({
            message: "No Addresses found",
            success: false
        })
        res.status(200).json({
            message: "Addresses fetched successfully",
            success: true,
            addresses
        })
    } catch (error) {
        console.error("Error getting addresses ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const getAddressById = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        const {id} = req.params;
        const address = await Address.findById(id);
        if(!address) return res.satus(404).jaon({
            message: "No Address found",
            success: false
        })
        res.status(200).json({
            message: "Address fetched successfully",
            success: true,
            address
        })
    } catch (error) {
        console.error("Error getting required address ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        const {id} = req.params;
        const address = await Address.findByIdAndDelete(id);
        if(!address) return res.satus(404).jaon({
            message: "No Address found",
            success: false
        })
        res.status(200).json({
            message: "Address deleted successfully",
            success: true,
            address
        })
    } catch (error) {
        console.error("Error deleting required address ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        const {id} = req.params;
        const {} = req.body;
        const address = await Address.findByIdAndDelete(id);
        if(!address) return res.satus(404).jaon({
            message: "No Address found",
            success: false
        })
        res.status(200).json({
            message: "Address deleted successfully",
            success: true,
            address
        })
    } catch (error) {
        console.error("Error deleting required address ", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}