import mongoose from 'mongoose';
import playlist from '../models/playlistModel.js';
import user from '../models/userModel.js';

// Get all playlists

const getAllPlaylists = async (req, res) => {
    try {
        const { userId } = req. query;
        if (!userId) return res.status(400).json({ status: false, message: 'User ID is required' });

        const objectId = new mongoose.Types.ObjectId(userId);
        const playlists = await playlist.find({ createdBy: objectId });
        console.log(playlists);
        
        if (playlists.length === 0) {
            return res.status(404).json({ status: false, message: 'No playlists found' });
        }

        return res.status(200).json({ status: true, playlists });

    } catch (error) {
        console.error('Error fetching playlists:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};

// Get single playlist

const getSinglePlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id;
        console.log(playlistId);

        // Find the playlist by ID
        const getPlaylist = await playlist.findById(playlistId);

        if (!getPlaylist) {
            return res.status(404).json({ status: false, message: 'Playlist not found' });
        }

        return res.status(200).json({ status: true, data:getPlaylist });

    } catch (error) {
        console.error('Error fetching playlist:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};


// Create a new playlist

const createPlaylist = async (req, res) => {
    try {
        const {userId,name,song} = req.body

        if (!userId || !name) {
            return res.status(400).json({ status: false, message: 'User ID and playlist title are required' });
        }
        const userExists = await user.findById(userId);
        if (!userExists) {
            return res.status(404).json({ status: false, message: 'User not found' })
        };

        const newPlaylist = await new playlist({
            createdBy: userId,
            name,
            songs:song?[song]:[],
        }).save();


        return res.status(201).json({ status: true, message: 'Playlist created successfully', playlist: newPlaylist });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const addSong=async(req,res) => {
    try {
        const playlistId = req.params.id;
        const song = req.body.song;
        if (!playlistId ||!song) {
            return res.status(400).json({ status: false, message: 'Playlist ID and song title are required' });
        }
        const playlistExists = await playlist.findByIdAndUpdate(playlistId, { $push: { songs: song } });
        
        
        if (!playlistExists) {
            return res.status(404).json({ status: false, message: 'Playlist not found' });
        }
        return res.status(200).json({ status: true, message: 'Song added successfully' });

    } catch (error) {
        console.error('Error adding song:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}

const deletePlaylist = async (req, res) => {
    try {
        const playlistId = req.params.id;

        // Find the playlist by ID
        const getPlaylist = await playlist.findByIdAndDelete(playlistId);

        if (!getPlaylist) {
            return res.status(404).json({ status: false, message: 'Playlist not found' });
        }

        return res.status(200).json({ status: true, message: 'Playlist deleted successfully' });

    } catch (error) {
        console.error('Error deleting playlist:', error);
        return res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
};


export {
    getAllPlaylists,
    getSinglePlaylist,
    createPlaylist,
    addSong,

}; 