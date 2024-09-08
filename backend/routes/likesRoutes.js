import { Router } from "express";
import { likeSong,unlikeSong,getUserLikesSongs,likeArtist,unlikeArtist,getUserLikesArtist } from "../controllers/likesController.js";

const router = Router();

router.get('/songs', getUserLikesSongs)

router.post('/songs/', likeSong)

router.delete('/songs/', unlikeSong)

router.get('/artists', getUserLikesArtist)

router.post('/artists/', likeArtist)

router.delete('/artists/', unlikeArtist)



export default router