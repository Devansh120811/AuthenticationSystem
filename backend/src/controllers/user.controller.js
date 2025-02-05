import { User } from "../models/UserModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
import { sendVerificationEmailForgotPassword } from "../utils/sendVerificationEmailForgotPassword.js";
const register = async (req, res) => {
  var user;
  const { username, email, password } = req.body
  // console.log(username,email,password)
  if (!username || !email || !password) {
    return res.json({ success: false, message: "Missing Details" })
  }
  try {
    const existingUserByUsername = await User.findOne({ username, IsAccountVerified: true });
    if (existingUserByUsername) {
      return res.json({ success: false, message: "User already Exists" })
    }
    const existingUserByEmail = await User.findOne({ email, IsAccountVerified: true })
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    if (existingUserByEmail) {
      if (existingUserByEmail.IsAccountVerified == true) {
        return res.json({ success: false, message: "User already Exists" })
      }
      else {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newExpiry = new Date()
        newExpiry.setHours(newExpiry.getHours() + 1)
        existingUserByEmail.password = hashedPassword
        existingUserByEmail.verifyOTPExpire = newExpiry
        existingUserByEmail.verifyOTP = otp
        await existingUserByEmail.save()
      }
    }
    else {
      const hashedPassword = await bcrypt.hash(password, 10)
      const otpExpiry = new Date()
      otpExpiry.setHours(otpExpiry.getHours() + 1)
      user = await User.create({
        username,
        email,
        password: hashedPassword,
        verifyOTP: otp,
        verifyOTPExpire: otpExpiry,
        IsAccountVerified: false,
        resetOTP: '',
        resetOTPExpire: 0
      })
    }


    const response = await sendVerificationEmail(email, username, otp, res)
    // console.log(response.success)
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 10 * 24 * 60 * 60 * 1000
    }
    if (response.success === true) {
      return res.status(201).cookie('accessToken',accessToken,options).json({ success: true, message: "User Registered Successfully. Please verify the Email", userData: { username: user.username, IsAccountVerified: user.IsAccountVerified,accessToken } })
    }
  } catch (error) {
    // console.log(error)
    return res.json({ success: false, message: "Error while Registering User" })
  }
}
const login = async (req, res) => {
  const { username, email, password } = req.body
  // console.log(email,password)
  if ((!email && !username) || !password) {
    return res.json({ success: false, message: "Missing Details" })
  }
  try {
    const user = await User.findOne({
      $or: [{ email }, { username }]
    })
    // console.log(user)
    if (!user) {
      return res.json({ success: false, message: "User does not exists" })
    }
    const PasswordCheck = await bcrypt.compare(password, user.password)
    // console.log(PasswordCheck)
    if (!PasswordCheck) {
      return res.json({ success: false, message: "Invalid Password" })
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 10 * 24 * 60 * 60 * 1000
    }

    // console.log(accessToken)
    return res.status(200).cookie('accessToken', accessToken, options).json({ success: true, message: "User logged in Successfully", userData: { username: user.username, IsAccountVerified: user.IsAccountVerified, accessToken } })
  } catch (error) {
    // console.log(error)
    return res.json({ success: false, message:'Error while Login' })
  }
}
const logout = async (req, res) => {
  // console.log(req.user)
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  }
  return res.clearCookie("accessToken", options).status(200).json({ success: true, message: "Logged Out Successfully." })

}
const verificationOTP = async (req, res) => {
  const { otp } = req.body
  const { username } = req.params
  const decodedUsername = decodeURIComponent(username)
  // console.log(decodedUsername)
  // console.log(otp)
  if (!otp) {
    return res.json({ success: false, message: "Otp is Required" })
  }
  try {
    const user = await User.findOne({ username: decodedUsername })
    // console.log(user)
    if (!user) {
      return res.json({ success: false, message: "User does not exists" })
    }
    const validOTP = user.verifyOTP === otp
    const expiry = new Date(user.verifyOTPExpire) > new Date()
    // console.log(validOTP,expiry)
    if (validOTP && expiry) {
      user.IsAccountVerified = true
      user.verifyOTP = ''
      user.verifyOTPExpire = 0
      await user.save()
      return res.status(200).json({ success: true, message: "User verified Successfully" })
    }
    else if (!validOTP) {
      return res.json({ success: false, message: "Invalid OTP." })
    }
    else if (!expiry) {
      return res.json({ success: false, message: "OTP Expired." })
    }
  } catch (error) {
    return res.json({ success: false, message: "Error verifying user" })
  }
}
const checkUsernameUnique = async (req, res) => {
  const { username } = req.params
  // console.log(username)
  if (!username) {
    return res.json({ success: false, message: "Username is required" })
  }
  try {
    const user = await User.findOne({ username, IsAccountVerified: true })
    if (user) {
      return res.json({ success: false, message: "Username already exists" })
    }
    return res.status(200).json({ success: true, message: "Username is unique" })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: "Error checking username" })
  }
}
const forgotPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.json({ success: false, message: "Email is Required" })
  }
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: "User does not exists" })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date()
    otpExpiry.setHours(otpExpiry.getHours() + 1)
    user.resetOTP = otp
    user.resetOTPExpire = otpExpiry
    await user.save()
    const response = await sendVerificationEmailForgotPassword(email, otp, res)
    if (response.success === true) {
      return res.status(201).json({ success: true, message: response.message })
    }
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: "Error Updating password" })
  }
}
const resetPasswordOTP = async (req, res) => {
  const { otp } = req.body
  const { username } = req.params
  if (!otp) {
    return res.json({ success: false, message: "Otp is Required" })
  }
  try {
    const user = await User.findOne({ username})
    if (!user) {
      return res.json({ success: false, message: "User does not exists" })
    }
    const validOTP = user.resetOTP === otp
    const expiry = new Date(user.resetOTPExpire) > new Date()
    if (validOTP && expiry) {
      user.resetOTP = ''
      user.resetOTPExpire = 0
      await user.save()
      // console.log(user)
      return res.status(200).json({ success: true, message: "OTP Verified Successfully" })
    }
    else if (!validOTP) {
      return res.json({ success: false, message: "Invalid OTP." })
    }
    else if (!expiry) {
      return res.json({ success: false, message: "OTP Expired." })
    }
  } catch (error) {
    // console.log(error)
    return res.json({ success: false, message: "Error verifying OTP for updating password" })
  }
}
const updatePassword = async (req, res) => {
  const { password } = req.body
  const { username } = req.params 
  // console.log(password,username)
  try {
    const user = await User.findOne({ username})
    if (!user) {
      return res.json({ success: false, message: "User does not exists" })
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    user.password = hashedPassword;
    await user.save()
    return res.status(200).json({ success: true, message: "Password Updated Successfully" })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: "Error updating password" })
  }
}
const getUser = async (req, res) => {
  // console.log(req.user)
  const userr = req.user
  try {
    const user = await User.findById(userr._id).select('-password')
    if (!user) {
      return res.json({ success: false, message: "User does not exits" })
    }
    return res.status(200).json({ success: true, message: "User Fetched Successfully", userData: { username: user.username, IsAccountVerified: user.IsAccountVerified } })
  } catch (error) {
    return res.json({ success: false, message: "Error getting user data" })
  }
}
const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ success: true })
  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}
export { register, login, logout, verificationOTP, checkUsernameUnique, forgotPassword, resetPasswordOTP, updatePassword, getUser, isAuthenticated }