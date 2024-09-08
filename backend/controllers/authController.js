import UserSchema from "../models/userModel.js";
import sendMail from "../mail/mail.js";
import crypto from "crypto"; 
import {sendWelcomeMessage} from "../mail/messeges/welcome.js"
import { sendOtpMessage } from "../mail/messeges/otp.js";


function capitalizeString(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const otpStore = {};

const signUp = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await UserSchema.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(409).json({ status: false, message: "Email already exists" });
        }

        // Hash the password before saving (make sure you use bcrypt or similar in your actual model)

        const newUser = await new UserSchema({
            name: capitalizeString(name),
            email: email.toLowerCase(),
            password: password,


        }).save();

        // Optionally, send a welcome email
        // await sendMail(email, welcome.subject, welcome.message);


        await sendWelcomeMessage(email,name)

        return res.status(200).json({
            status: true,
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profileURL: newUser.profileURL
            }
        });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ status: false, message: error.message });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    

    try {
        const user = await UserSchema.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ status: false, message: "User does not exist" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: "Invalid password" });
        }

        return res.status(200).json({
            status: true,
            message: "User logged in successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profileURL: user.profileURL,
            }
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({ status: false, message: error.message });
    }
};


const sendOTP = async (req, res) => {

    const { email } = req.body;
    
    try {
        const otp = crypto.randomInt(100000, 999999).toString();

        await sendOtpMessage(email, otp);

      
        const id = crypto.randomUUID(); 

        otpStore[id] = otp;

        setTimeout(() => {
            delete otpStore[id];
        }, 10 * 60 * 1000);

        console.log(otpStore);

        return res.status(200).json({ status: true, message: "OTP sent successfully", messageId:id });

    } catch (error) {
        console.error('Error sending OTP:', error.message);
        return res.status(500).json({ status: false, message: error.message });
    }
};



const verifyOTP = async (req, res) => {
    const { otp, messageId:id } = req.body;
    console.log(otpStore);
    console.log(id);

    try {
        if (!otpStore[id]) {
            return res.status(401).json({ status: false, message: "OTP expired or invalid" });
        }

        if (otpStore[id] !== otp) {
            return res.status(401).json({ status: false, message: "Enter a Valid OTP" });
        }

        delete otpStore[id];
        return res.status(200).json({ status: true, message: "OTP verified successfully" });

    } catch (error) {
        console.error('Error verifying OTP:', error.message);
        return res.status(500).json({ status: false, message: error.message });
    }
};


const findUser = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await UserSchema.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ status: false, message: "User does not exist" });
        }
        return res.status(200).json({
            status: true, message: "User found successfully", user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profileURL: user.profileURL,
            }
        });
    } catch (error) {
        console.error('Error finding user:', error.message);
        return res.status(500).json({ status: false, message: error.message });
    }

};


const resetPassword =async (req, res) => {
    const { email, password:newPassword } = req.body;
    try {
        const user = await UserSchema.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ status: false, message: "User does not exist" });
        }
        user.password = newPassword;
        await user.save();
        await sendMail(email, "Password Reset", "Your Account password has been reset successfully.");
        return res.status(200).json({ status: true, message: "Password reset successfully" });

    } catch (error) {
        console.error('Error resetting password:', error.message);
        return res.status(500).json({ status: false, message: error.message });
    }


};


export { signUp, login, sendOTP, verifyOTP, findUser,resetPassword };