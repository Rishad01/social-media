import express from "express";
import cors from "cors";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
 const app=express(); 
 app.use(express.json());
 app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
 app.use(cors(
   {
      origin:["http://localhost:3000"],
      methods:["POST", "GET"],
      credentials:true,
      allowedHeaders: 'Authorization,Content-Type'
   }
 ));

 app.listen(5000,()=>{
    console.log('listening...');
  });