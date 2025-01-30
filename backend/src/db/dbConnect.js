import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'

const dbConnect  = async ()=>{
 try {
     const connections = await mongoose.connect(`${process.env.MONGODB_URL}${DB_NAME}`)
     console.log(`MongoDB connected successfully ${connections.connection.host}`)
 } catch (error) {
    console.log("Error While Connecting to the database.",error)
 }
}
export default dbConnect