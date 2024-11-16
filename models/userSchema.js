import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";


const userSchema = new mongoose.Schema({
   name:{
     type: String,
     required: true,
     minLength: [5, "Name must cotain at least 5 characters."],
     maxLength: [30, "Name cannot exceed 30 characters"]
   },
   email:{
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide valid email"]
   },
   phone:{
     type: Number,
     required: true,
   },
   address:{
     type: String,
     required: true,
   },
   niches:{
     firstNiche: String,
     secoundNiche: String,
     thiredNiche: String,
   },
   password:{
     type: String,
     required: true,
     minLength: [8, "Password mast be 8 character "],
     maxLength: [32, "Password cannot exceed 32 character "]
   },
   resume: {
     public_id: String,
     url: String,
   },
   coverLetter:{
     type: String,
   },
   role: {
     type: String,
     required: true,
     enum: ["job Seeker", "Employer"]
   },
   createdAt:{
     type: Date,
     default: Date.now,
   }
})

export const User = mongoose.model("User", userSchema);