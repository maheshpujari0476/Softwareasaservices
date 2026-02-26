import jwt from "jsonwebtoken";
import { redisclient } from "../config/redisdb.js";

export const authMiddleware = async(req,res,next)=>{
  try{
    const token = req.cookies.token;
    if(!token) return res.status(400).json({message:"Unauthorized"})

        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY);
        const stored = await redisclient.get(`session:${decoded.id}`)
      
        if(!stored || stored !== token) return res.status(401).json({message:"Session Expired"})
        
        req.user = decoded;// attach user info to request
        next();
  }catch(error){
    next(error);
  }
}