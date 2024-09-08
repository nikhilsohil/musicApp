import UserSchema from "../models/userModel.js";



const likeSong = async (req, res) => {


    const { songId, userId } = req.body;
    console.log(songId, userId);
    

    if (!songId || !userId) {
        return res.status(400).json({ status: false, message: "Song ID and User ID are required" });
    }

    try {
        const user = await UserSchema.findById(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        if (user.likedSongs.includes(songId)) {
            return res.status(400).json({ status: false, message: "Song is already liked" });
        }

        user.likedSongs.push(songId);
        await user.save();

        return res.status(200).json({ status: true, message: "Song liked successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};



const unlikeSong = async (req, res) => {
    const { songId, userId } = req.body;

    if (!songId || !userId) {
        return res.status(400).json({ status: false, message: "Song ID and User ID are required" });
    }

    try {
        const user = await UserSchema.findById(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        if (!user.likedSongs.includes(songId)) {
            return res.status(400).json({ status: false, message: "Song is not in the liked songs list" });
        }

        user.likedSongs.pull(songId);
        await user.save();

        return res.status(200).json({ status: true, message: "Song unliked successfully" });
    } catch (error) {
        console.error("Error unliking song:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};


const getUserLikesSongs = async (req, res) => {
    const { userId } = req.query;
    
    if (!userId) {
        return res.status(400).json({ status: false, message: "User ID is required" });
    }

    try {
        const user = await UserSchema.findById(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        if (user.likedSongs.length > 0) {
            return res.status(200).json({ status: true, message: "User's liked songs retrieved successfully", likedSongs: user.likedSongs });
        } else {
            return res.status(200).json({ status: true, message: "No liked songs found", likedSongs: [] });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};



const likeArtist = async (req, res) => {
    const { artistId, userId } = req.body;

    if (!artistId || !userId) {
        return res.status(400).json({ status: false, message: "Artist ID and User ID are required" });
    }

    try {
        const user = await UserSchema.findById(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }


        if (user.likedArtists.includes(artistId)) {
            return res.status(400).json({ status: false, message: "Artist is already liked" });
        }

        user.likedArtists.push(artistId);
        await user.save();

        return res.status(200).json({ status: true, message: "Artist liked successfully" });
    } catch (error) {
        console.error("Error liking artist:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};



const unlikeArtist = async (req, res) => {
    const { artistId, userId } = req.body;

    if (!artistId || !userId) {
        return res.status(400).json({ status: false, message: "Artist ID and User ID are required" });
    }

    try {
        const user = await UserSchema.findById(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }


        if (!user.likedArtists.includes(artistId)) {
            return res.status(400).json({ status: false, message: "Artist is not in the liked artists list" });
        }

        user.likedArtists.pull(artistId);
        await user.save();

        return res.status(200).json({ status: true, message: "Artist unliked successfully" });
    } catch (error) {
        console.error("Error unliking artist:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};

const getUserLikesArtist = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ status: false, message: "User ID is required" });
    }

    try {
        const user = await UserSchema.findById(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        if (user.likedArtists.length > 0) {
            return res.status(200).json({ status: true, message: "Liked artists retrieved successfully", likedArtists: user.likedArtists });
        } else {
            return res.status(200).json({ status: true, message: "No liked artists found", likedArtists: [] });
        }
    } catch (error) {
        console.error("Error retrieving liked artists:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
};




export {
    likeSong,
    unlikeSong,
    getUserLikesSongs,
    likeArtist,
    unlikeArtist,
    getUserLikesArtist
}