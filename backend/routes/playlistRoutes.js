import { Router } from "express";

import { createPlaylist, getAllPlaylists, getSinglePlaylist,deletePlaylist,addSong } from "../controllers/playlistController.js";

const routes = Router();


routes.get('/',getAllPlaylists);

routes.get('/:id',getSinglePlaylist);

routes.post('/create',createPlaylist);

routes.post('/:id/addsong',addSong);

routes.delete('/:id',deletePlaylist);








export default routes