import { Router } from "express";
import {getUser, updateProfile,changePassword ,uploadProfilePhoto,removeProfilePhoto} from "../controllers/usersController.js";
import upload from "../multer/multer.js";

const router = Router();

router.get('/',getUser)

router.put('/changepassword', changePassword);

router.put('/updateprofile', updateProfile);

router.post('/uploadProfilePhoto',upload.single('image'), uploadProfilePhoto);
router.delete('/removeProfilePhoto',removeProfilePhoto)

export default router;
