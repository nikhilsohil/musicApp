import mongoose from "mongoose";


// Import the required models

const playlistschema = new mongoose.Schema({

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    songs: {
        type: Array,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    image: {
        type: Array,
        default: [
            {
                "quality": "50x50",
                "url": "https://res.cloudinary.com/dzkwvfyei/image/upload/v1725823431/default-playlist_nkeolz.png"
            },
            {
                "quality": "150x150",
                "url": "https://res.cloudinary.com/dzkwvfyei/image/upload/v1725823431/default-playlist_nkeolz.png"
            },
            {
                "quality": "500x500",
                "url": "https://res.cloudinary.com/dzkwvfyei/image/upload/v1725823431/default-playlist_nkeolz.png",
            }
        ],
    }

});

playlistschema.pre('save', async function (next) {
    console.log(this.songs);
    // console.log(this.songs.length);
    if (this.songs.length > 0) {
        this.image = this.songs[0].image;
    }
    next();
})

playlistschema.pre('findOneAndUpdate', async function (next) {
    console.log(this.getUpdate());
    const update = this.getUpdate();

    if (update.songs && update.songs.length > 0) {
        this.set('image', update.songs[0].image);
    }
})

export default new mongoose.model("playlist", playlistschema);
