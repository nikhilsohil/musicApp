import { v2 as cloudinary } from 'cloudinary';
import "dotenv";
import fs from 'fs';



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadOnCloudnary = async (file) => {

    try {
        if (!file) {
            return null;
        }
        const result = await cloudinary.uploader.upload(file, {folder:"Tunestream",
            eager: [
                {
                    width: 500, height: 500,
                    crop: "fill",aspect_ratio: "1.0"
                },
                {
                    width: 500, height: 500,
                    crop: "crop", gravity: "face"
                },
                {
                    width: 500, height: 500,
                    crop: "fit",
                },
            ]
        });

        fs.unlinkSync(file);
        return result;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}


export default uploadOnCloudnary