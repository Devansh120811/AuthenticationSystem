import { Router } from "express";
import { register, login, logout, verificationOTP, checkUsernameUnique, forgotPassword, resetPasswordOTP, updatePassword, getUser, isAuthenticated } from "../controllers/user.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
const router = Router()
router.route('/register').post(register)
router.route('/register/verifyOTP/:username').post(verificationOTP)
router.route('/checkusername/:username').get(checkUsernameUnique)
router.route('/forgot-password').post(forgotPassword)
router.route('/forgot-password/verify/:username').post(resetPasswordOTP)
router.route('/forgot-password/:username').post(updatePassword)
router.route('/login').post(login)
router.route('/get-user-data').get(authenticateUser, getUser)
router.route('/logout').get(authenticateUser, logout)
router.route('/is-auth').get(authenticateUser, isAuthenticated)
export default router