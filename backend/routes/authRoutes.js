import { Router } from "express";
import { login, signUp,sendOTP,verifyOTP,findUser,resetPassword } from "../controllers/authController.js";

const router=Router();

// Define routes

router.post('/login', login);

router.post('/signup',signUp)

router.get('/finduser/:email',findUser);

router.post('/resetpassword', resetPassword);

router.post('/sendotp/',sendOTP);

router.post('/verifyotp',verifyOTP);


export default router;