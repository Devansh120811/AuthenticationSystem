import { User } from "../models/UserModel.js";
import jwt from 'jsonwebtoken'


const authenticateUser = async (req,res,next)=>{
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")
        // console.log(token)
        if(!token){
            return res.status(401).json({success:false,message:"Unauthorized Request"}) 
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const userr = await User.findById(decodedToken.id).select('-password')
        if(!userr){
            return res.status(401).json({success:false,message:"Invalid Accesstoken"}) 
        }
        req.user = userr
        next()
    } catch (error) {
        // console.log(error)
        return res.status(401).json({success:false,message:"Invalid Accesstoken"})   
    }
}

export default authenticateUser