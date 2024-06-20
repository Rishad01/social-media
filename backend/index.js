import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import postRoutes from './posts.js';
import jwt from "jsonwebtoken";
import { jwtAuthMiddleware,generateToken } from "./jwt.js";
 const app=express(); 
 app.use(express.json());
 app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
 app.use(cors(
   {
      origin:["http://localhost:3000"],
      methods:["POST", "GET","DELETE","PUT"],
      credentials:true,
      allowedHeaders: 'Authorization,Content-Type'
   }
 ));

try{
 mongoose.connect('mongodb://localhost:27017/socialmedia')
 console.log('DB connected...');
}catch(err)
{
    console.error(err);
}

 const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  });
  
  const User = mongoose.model('User', userSchema);

  app.post('/register', async (req, res) => {
    try {
      const { email, password, username } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const check=await User.findOne({email:email});
      if(check)
        {
            res.json({ message: 'User already registered' });
        }
        else{
              const user=await User.create({
                email,
                password: hashedPassword,
                username
              });
              console.log(user._id);
              const token=generateToken(user._id);
              res.status(201).json({ message: 'User registered successfully',token:token });
        }
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error registering user', error: err.message });
    }
  });

  app.post('/login',async (req,res)=>{
    const {username,password}=req.body;
    try{
    const check=await User.findOne({username:username});
    if(check)
        {
            bcrypt.compare(password,check.password, (err, result)=>{
                if(err)
                    {
                        res.status(500).json({ message: 'Error comparing password', error: err.message });
                    }

                if(result)
                    {
                        console.log(check._id);
                        const user={id:check._id,username:check.username}
                        const token=generateToken(user);
                        res.status(201).json({ message: 'Logged In Successfully', token:token});
                    }
                else
                    {
                        res.json({ message: 'Wrong Password'});
                    }
            });
        }
        else{
            res.json({ message: 'Register Yourself'});
        }
    }catch(err)
    {
      console.error(err);
      res.status(500).json({ message: 'Error logging user', error: err.message });
    }

  });

 app.use('/api/posts', postRoutes);

 app.listen(5000,()=>{
    console.log('listening...');
  });