import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import postRoutes from './posts.js';
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import { jwtAuthMiddleware,generateToken } from "./jwt.js";
 const app=express(); 
 app.use(express.json());
 app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
 app.use(cors(
   {
      origin:["https://social-media-nine-pink.vercel.app/"],
      methods:["POST", "GET","DELETE","PUT"],
      credentials:true,
      allowedHeaders: 'Authorization,Content-Type'
   }
 ));

try{
 mongoose.connect('mongodb+srv://rishadhusainrizvi786:WqC5ILRgwFLi5Rvz@cluster0.caujlwq.mongodb.net/socialmedia')
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
              const userpayload={id:user._id,username:user.username}
              const token=generateToken(userpayload);
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

  app.post('/forgot_password', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour (3600000 ms)
  
      await user.save();
  
      // Send email with reset link
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'rhr111984@gmail.com',
          pass: 'jlyp gjud skrv hgwh'
        }
      });

      const mailOptions = {
        from: 'rhr111984@gmail.com',
        to: user.email,
        subject: 'Password Reset Request',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n`
          + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
          + `http://${req.headers.host}/reset/${resetToken}\n\n`
          + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };
  
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.error('Error sending email:', err);
          return res.status(500).json({ message: 'Failed to send reset email' });
        }
        res.status(200).json({ message: 'Reset email sent' });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  
  app.post('/reset_password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() } // Check if token is still valid
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      // Reset password
      const hashedPassword = await bcrypt.hash(newPassword,10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  });

 app.use('/api/posts', postRoutes);

 app.listen(5000,()=>{
    console.log('listening...');
  });