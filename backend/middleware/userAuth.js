import handleAsyncError from "./handleAsyncError.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import handleError from "../utils/handleError.js";

export const verifyUser = handleAsyncError(async(req,res,next) =>{
    const {token} = req.cookies;
    console.log(token);
    if(!token || token === "j:null"){
        return next(new handleError("Please login to access this resource", 401));
    }
    
    const decodeData = jwt.verify(token,process.env.JWT_SECRET_KEY);
    console.log(decodeData);
    req.user = await User.findById(decodeData.id);
    next()
})


export const roleBaseAcess = (...roles) =>{
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new handleError("You are not allowed to access this resource", 403));
        }
        next();
    }
}