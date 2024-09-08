
import { backend_Base_url } from '../constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";


const base_url=backend_Base_url

export const getUserDetails = createAsyncThunk('getUserDetails', async (userId) => {
    try {
        const response = await axios.get(`${base_url}/users`,{
            params:{
                userId
            }
        })
        console.log(response.data);
        
        return response.data;

    } catch (error) {
        console.log(error.responce.data)
        return error.responce.data;
    }
})

export const fetchLikedSongs = createAsyncThunk('fetchLikedSongs', async (userId) => {

    try {
        const response = await axios.get(`${base_url}/likes/songs?userId=${userId}`)
        return response.data.likedSongs;
    } catch (error) {
        console.log(error.response.data);
        return error.response.data;

    }

})

// Create A thunk for fetching the likedArtist information from the server

export const fetchLikedArtists = createAsyncThunk('fetchLikedArtists', async (userId) => {
    try {
        const response = await axios.get(`${base_url}/likes/artists?userId=${userId}`)
        return response.data.likedArtists;
    } catch (error) {
        console.log(error.response.data);
        return error.response.data;

    }
})

// Create a thunk for like a song in the database

export const likeSong = createAsyncThunk('likeSong', async ({ songId, userId }, { rejectWithValue }) => {
    try {
        console.log(songId);

        const responce = await axios.post(`${base_url}/likes/songs`, { songId, userId });
        console.log(responce);

        return songId;
    } catch (error) {
        console.log(error.response.message);
        return rejectWithValue(error.response.message);

    }
})

// Create a thunk for unlike a song in the database

export const unlikeSong = createAsyncThunk('unlikeSong', async ({ songId, userId }, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${base_url}/likes/songs/`, {
            data: { songId, userId }
        });
        console.log(response);
        return songId;

    } catch (error) {
        console.log(error.response.message);
        return rejectWithValue(error.response.message);

    }
})

export const likeArtist = createAsyncThunk("likeArtist", async ({ artistId }, { getState, rejectWithValue }) => {
    try {
        const { user } = getState().player;
        const response = await axios.post(`${base_url}/likes/artists`, { artistId, userId: user._id });
        console.log(response);
        return artistId;
    } catch (error) {
        console.log(error.response.message);
        return rejectWithValue(error.response.message);
    }
})

export const unlikeArtist = createAsyncThunk('unlikeArtist', async ({ artistId }, { getState, rejectWithValue }) => {
    try {
        const { user } = getState().player;
        console.log(artistId, user._id);
        const response = await axios.delete(`${base_url}/likes/artists`, {
            data: { artistId, userId: user._id }
        });
        console.log(response);
        return artistId;

    } catch (error) {
        console.log(error.response.message);
        return rejectWithValue(error.response.message);

    }
})

