import dbConnect from "./db/dbConnect.js";
import dotenv from 'dotenv'
import app from "./app.js";
dotenv.config({
    path: './.env'
})

dbConnect().then(() => {
    app.listen(process.env.PORT,() => {
        console.log(`App listening at PORT ${process.env.PORT}`)
    })
}).catch((e) => {
    console.log("Error", e)
})