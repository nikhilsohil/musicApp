import { Router } from "express";
import {getUser, updateProfile,changePassword ,uploadProfilePhoto} from "../controllers/usersController.js";
import upload from "../multer/multer.js";

const router = Router();

router.get('/',getUser)

router.put('/changepassword', changePassword);

router.put('/updateprofile', updateProfile);

router.post('/uploadProfilePhoto',upload.single('image'), uploadProfilePhoto);

export default router;
