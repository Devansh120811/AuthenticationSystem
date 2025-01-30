import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import passport from 'passport'
import GoogleStrategy from 'passport-google-oauth20'
import userrouter from './routes/user.routes.js'
const app = express()

const googleStrategy = GoogleStrategy.Strategy
app.use(cors({
    origin: process.env.CORS_URL,
    credentials: true
}))
app.use(express.json({
    limit:"100mb"
}))
app.use(express.urlencoded({
    limit:"100mb",
    extended:true
}))
app.use(express.static('public'))
app.use(cookieParser())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new googleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'http://localhost:3000/auth/google/callback'
},(accessToken,refreshToken,profile,done)=>{
    return done(null,profile)
}))
passport.serializeUser((user,done)=>done(null,user))
passport.deserializeUser((user,done)=>done(null,user))
app.use('/',userrouter)
app.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
app.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/'}),(req,res)=>{
    res.redirect('/home')
})
export default app