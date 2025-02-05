import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
// import passport from 'passport'
// import session from 'express-session'
// import GoogleStrategy from 'passport-google-oauth20'
import userrouter from './routes/user.routes.js'
const app = express()

// const googleStrategy = GoogleStrategy.Strategy
app.use(cors({
    origin: process.env.CORS_URL,
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
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

app.use('/',userrouter)
// app.use(session({
//     secret: process.env.SESSION_SECRET, // Change this to a strong secret
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false } // Set to true if using HTTPS
//   }));
// app.use(passport.initialize())
// app.use(passport.session())
// passport.use(new googleStrategy({
//     clientID:process.env.GOOGLE_CLIENT_ID,
//     clientSecret:process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL:'http://localhost:3000/auth/google/callback'
// },(accessToken,refreshToken,profile,done)=>{
//     return done(null,profile)
// }))
// passport.serializeUser((user,done)=>done(null,user))
// passport.deserializeUser((user,done)=>done(null,user))
// app.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
// app.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/login'}),(req,res)=>{
//     res.redirect('/home')
// })
export default app