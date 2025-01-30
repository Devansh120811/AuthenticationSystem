import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({

},{timestamps:true})

export const user = mongoose.model("user",UserSchema)