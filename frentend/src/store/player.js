import { createSlice } from "@reduxjs/toolkit";
import { data } from "../data/song";
import { fetchLikedArtists, fetchLikedSongs, likeSong, unlikeSong, likeArtist, unlikeArtist, getUserDetails } from "./asyncAction";


const initialState = {
  isLogin: localStorage.getItem('user') ? true : false,
  user: JSON.parse(localStorage.getItem('user')) || null,
  state: 'idel',
  error: null,
  likedSongs: [],
  likedArtists: [],
  isPlayed: false,
  currentTrack: 0,
  progress: 0,
  queue: [data],
  currentPlaylistId: data.id,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {

    login: (state, action) => {
      state.isLogin = true;
      state.user = action.payload;
    },

    logout: (state) => {
      state.isLogin = false;
      state.user = null;
      localStorage.removeItem('user');
      state.isPlayed = false;
    },

    play: (state) => {
      state.isPlayed = true;
    },


    pause: (state) => {
      state.isPlayed = false;
    },


    updateProgress: (state, action) => {
      state.progress = action.payload
    },


    updateCurrentTrack: (state, action) => {
      state.currentTrack = action.payload
    },


    updateQueue: (state, action) => {
      state.queue = action.payload.songs;
      state.currentPlaylistId = action.payload.playlistId;
    },


    addToQueue: (state, action) => {
      state.queue.push(action.payload);
    },

    removeFromQueue: (state, action) => {
      const index = action.payload;
      state.queue = state.queue.filter((_, i) => i !== index);
    },



    likeArtist: (state, action) => {
      state.likedArtists.push(action.payload);
    },

    unlikeArtist: (state, action) => {
      state.likedArtists = state.likedArtists.filter(id => id !== action.payload);
    },

  },

  extraReducers: (builder) => {

    builder.addCase(getUserDetails.pending, (state) => {
      state.state = 'loading';
    });

    builder.addCase(getUserDetails.fulfilled, (state, action) =>{
      state.state ='fatched';
      console.log(action.payload);
      
      state.user=action.payload.user;
    })

    builder.addCase(getUserDetails.rejected, (state, action) => {
      state.state = 'error';
      state.error = action.message;
    });



    builder.addCase(fetchLikedSongs.pending, (state) => {
      state.state = 'loading';
    });
    builder.addCase(fetchLikedSongs.fulfilled, (state, action) => {
      state.state = 'featched';
      state.likedSongs = action.payload;
    });
    builder.addCase(fetchLikedSongs.rejected, (state, action) => {
      state.state = 'error';
      state.error = action.message;
    });

    // Fetch the liked artists from the database
    builder.addCase(fetchLikedArtists.pending, (state) => {
      state.state = 'loading';
    });
    builder.addCase(fetchLikedArtists.fulfilled, (state, action) => {
      state.state = 'featched';
      state.likedArtists = action.payload;
    });
    builder.addCase(fetchLikedArtists.rejected, (state, action) => {
      state.state = 'error';
      state.error = action.message;
    });


    // Like a song
    builder.addCase(likeSong.pending, (state) => {
      state.state = 'loading';
    });

    builder.addCase(likeSong.fulfilled, (state, action) => {
      state.state = 'featched';
      state.likedSongs.push(action.payload);
    });

    builder.addCase(likeSong.rejected, (state, action) => {
      state.state = 'error';
      state.error = action.message;
    });


    // Unlike a song
    builder.addCase(unlikeSong.pending, (state) => {
      state.state = 'loading';
    });

    builder.addCase(unlikeSong.fulfilled, (state, action) => {
      state.state = 'featched';
      console.log(action.payload);
      state.likedSongs = state.likedSongs.filter(id => id !== action.payload);
    });

    builder.addCase(unlikeSong.rejected, (state, action) => {
      state.state = 'error';
      state.error = action.message;
    });

    //like Artist
    builder.addCase(likeArtist.pending, (state) => {
      state.state = 'loading';
    });
    builder.addCase(likeArtist.fulfilled, (state, action) => {
      state.likedArtists.push(action.payload);
    });
    builder.addCase(likeArtist.rejected, (state, action) => {
      state.state = 'error';
      state.error = action.message;
    });
    //Unlike Artist

    builder.addCase(unlikeArtist.pending, (state) => {
      state.state = 'loading';
    });
    builder.addCase(unlikeArtist.fulfilled, (state, action) => {
      state.likedArtists = state.likedArtists.filter(id => id !== action.payload);
    });
    builder.addCase(unlikeArtist.rejected, (state, action) => {
      state.state = 'error';
      state.error = action.message;
    });

  }
});

export const playerAction = playerSlice.actions;
export default playerSlice;