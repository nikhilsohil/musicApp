import User from "../models/userModel.js";
import uploadOnCloudnary from "../utils/cloudnary.js";


function capitalizeString(str) {
    return str
        ?.toLowerCase()
        ?.split(' ')
        ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
        ?.join(' ');
}


const getUser = async (req, res) => {
    const { userId } = req.query;
    try {

        if (!userId) {
            return res.status(400).json({ status: false, message: "User ID is required" });
        }
        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        
        res.status(200).json({ status: true, user:{
            _id: userDetails._id,
            name: userDetails.name,
            email: userDetails.email,
            profileURL: userDetails.profileURL
        } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Server error" });
    }
}

const changePassword = async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    if (!userId) {
        return res.status(400).json({ status: false, message: "user not found" });
    }
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ status: false, message: "currentPassword and newPassword are required" });
    }
    const userDetails = await User.findById(userId);
    if (!userDetails) {
        return res.status(400).json({ status: false, message: "User not found" });
    }
    const isMatch = await userDetails.comparePassword(currentPassword);
    if (!isMatch) {
        return res.status(401).json({ status: false, message: "incorrect password" });
    }
    userDetails.password = newPassword;
    await userDetails.save();
    res.status(200).json({ status: false, message: "Password updated successfully" });

}

const updateProfile = async (req, res) => {
    const { userId, name, email } = req.body;

    if (!userId) {
        return res.status(400).json({ status: false, message: "User not found" });
    }
    const userDetails = await User.findByIdAndUpdate(userId, { name: capitalizeString(name), email }, { new: true });
    if (!userDetails) {
        return res.status(404).json({ status: false, message: "User not found" });
    }
    res.status(200).json({
        status: true, message: "Profile updated successfully", user: {
            _id: userDetails._id,
            name: userDetails.name,
            email: userDetails.email,
        }
    });
}

const uploadProfilePhoto = async (req, res) => {
    const { userId } = req.body;
    
    console.log("Request body:", userId);

    // Check if userId exists
    if (!userId) {
        return res.status(400).json({ status: false, message: "User not found" });
    }

    try {
        // Find the user by ID
        const userDetails = await User.findById(userId);
        console.log(userDetails);
        
        if (!userDetails) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Get the file from the request (assumes multer or similar middleware)
        const file = req.file?.path;
        console.log(req.file);
        
        if (!file) {
            return res.status(400).json({ status: false, message: "No file uploaded" });
        }

        // Upload file to Cloudinary
        const result = await uploadOnCloudnary(file);
        if (!result) {
            return res.status(500).json({ status: false, message: "Failed to upload photo" });
        }

        // Update the user's profile URL
        userDetails.profileURL = result.eager[0].url; // Assuming eager transformation for better optimization
        await userDetails.save();

        // Respond with updated user data
        return res.status(200).json({
            status: true,
            message: "Profile photo updated successfully",
            user: {
                _id: userDetails._id,
                name: userDetails.name,
                email: userDetails.email,
                profileURL: userDetails.profileURL,
            },
        });
    } catch (error) {
        // Log the error for debugging
        console.error("Error uploading photo:", error);

        // Handle any unexpected errors
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};



export {
    getUser,
    changePassword,
    updateProfile,
    uploadProfilePhoto
};