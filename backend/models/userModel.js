import  mongoose from "mongoose";
import bcrypt from "bcrypt";

// Import the required models

const userschema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileURL: {
        type: String,
        default: "https://res.cloudinary.com/dzkwvfyei/image/upload/v1725438026/user_iwaekd.jpg"
    },
    likedSongs:{
        type: Array,
        default: [],
    },
    likedArtists:{
        type: Array,
        default: [],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },


});

userschema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        }
        catch (err) {
            console.error(err);
            return next(err);
        }
    }
    next();
});

userschema.methods.comparePassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};




export default  new mongoose.model("user", userschema);
