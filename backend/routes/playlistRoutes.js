import { Router } from "express";

import { createPlaylist, getAllPlaylists, getSinglePlaylist,addSong } from "../controllers/playlistController.js";

const routes = Router();


routes.get('/',getAllPlaylists);

routes.get('/:id',getSinglePlaylist);

routes.post('/create',createPlaylist);

routes.post('/:id/addsong',addSong);








export default routes