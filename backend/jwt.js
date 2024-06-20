import jwt from 'jsonwebtoken';
import { secretKey } from './config.js';

const jwtAuthMiddleware=(req,res,next)=>{
    //console.log('jwt');
    const authheader=req.headers.authorization;

    if(!authheader)
        {
            console.log(req.headers);
            return res.status(401).json({ error: 'Token not found'});
        }
        
    const token=authheader.split(' ')[1];
        if(!token)
            return res.status(401).json({ error: 'unauthorized'});

        try{
            const decoded=jwt.verify(token,secretKey);
            console.log(decoded);
            req.user=decoded;
            next();
        }
        catch(err){
            console.error(err);
            res.status(401).json({ error: 'Invalid Token',message: err.message});
        }
}

const generateToken=(userdata)=>{
    return jwt.sign(userdata,process.env.JWT_SECRET,{expiresIn:'24h'});
}

export  {jwtAuthMiddleware,generateToken};