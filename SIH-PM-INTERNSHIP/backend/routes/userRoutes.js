import  express from 'express';
import {  forgetPassword, loginUser, logOutUser, myProfile, registerWithOtp, resetPassword, userProfile, verifyOtpAndRegister, updateBasicInfo, updateEducation, updatePreferences, updateProjectsCerts, mergeSkills, getOcrDraft, setOcrDraft, applyOcrDraft, uploadResumeAndExtract, getRecommendations } from '../controllers/userController.js';
import { isAuth } from '../middlewares/isAuth.js';
import uploadFile from '../middlewares/multer.js';


const router=express.Router();

router.post("/register",registerWithOtp);
router.post("/verifyOtp/:token",verifyOtpAndRegister);
router.post("/login",loginUser);
router.post("/forget",forgetPassword);
router.post("/reset-password/:token",resetPassword);
router.get("/logout",isAuth,logOutUser);
router.get("/me",isAuth,myProfile);

// Profile step routes
router.put('/profile/basic', isAuth, updateBasicInfo);
router.put('/profile/education', isAuth, updateEducation);
router.put('/profile/preferences', isAuth, updatePreferences);
router.put('/profile/projects-certs', isAuth, updateProjectsCerts);
router.put('/skills', isAuth, mergeSkills);

// OCR draft routes (will be used after OCR pipeline fills draft)
router.get('/ocr-draft', isAuth, getOcrDraft);
router.post('/ocr-draft', isAuth, setOcrDraft);
router.post('/ocr-apply', isAuth, applyOcrDraft);

// Resume upload + OCR extract
router.post('/resume/extract', isAuth, uploadFile, uploadResumeAndExtract);

// Recommendations (proxy to Python service)
router.get('/recommendations', isAuth, getRecommendations);

// Dynamic route should be last
router.get("/:id", isAuth, userProfile);

export default router;