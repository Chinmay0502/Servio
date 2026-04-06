import Address from "../models/address.model.js";
import User from "../models/user.model.js";

export const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        const { houseNo, street, landmark, area, city, state, pincode, location } = req.body;
        if (!houseNo || !street || !area || !city || !state || !pincode) {
            return res.status(400).json({
                message: "All required fields must be provided",
                success: false
            });
        }
        if (
            !location ||
            !location.coordinates ||
            location.coordinates.length !== 2
        ) {
            return res.status(400).json({
                message: "Valid location coordinates required",
                success: false
            });
        }
        const address = await Address.create({
            userId: user._id,
            houseNo,
            street,
            landmark,
            area,
            city,
            state,
            pincode,
            location
        })
        return res.status(201).json({
            message: "Address added successfully",
            success: true,
            address
        })
    } catch (error) {
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
        if (!user) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        const addresses = await Address.find({ userId: user._id });

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
        if (!user) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        const { id } = req.params;
        const address = await Address.findById(id);
        if (!address) return res.status(404).json({
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
        if (!user) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        const { id } = req.params;
        const address = await Address.findOneAndDelete({
            _id: id,
            userId: req.user.id
        });
        if (!address) return res.status(404).json({
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
        if (!user) return res.status(401).json({
            message: "Unauthorized access",
            success: false
        })
        const { id } = req.params;
        const { houseNo, street, landmark, area, city, state, pincode, location, isDefault } = req.body;
        const address = await Address.findOne({ _id: id, userId: user._id });
        if (!address) return res.status(404).json({
            message: "No Address found",
            success: false
        })

        if (houseNo) address.houseNo = houseNo;
        if (street) address.street = street;
        if (landmark) address.landmark = landmark;
        if (area) address.area = area;
        if (city) address.city = city;
        if (state) address.state = state;
        if (pincode) address.pincode = pincode;
        if (location) address.location = location;

        if (isDefault) {
            await Address.updateMany(
                { userId: user._id },
                { isDefault: false }
            );
            address.isDefault = true;
        }

        await address.save();
        res.status(200).json({
            message: "Address updated successfully",
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