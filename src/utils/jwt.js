import jwt from 'jsonwebtoken';

export const generateToken = async(payload)=>{
    return jwt.sign(payload,process.env.JWT_SECRETKEY,{expiresIn:'1h'});
}

export const refreshToken = async(payload)=>{
    return jwt.sign(payload,process.env.JWT_REFRESHKEY,{expiresIn:"7d"});
}