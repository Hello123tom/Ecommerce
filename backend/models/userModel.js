import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide a name"],
        maxLenght:[25,"Invalid name, Please enter the name with fewer than 25 characters"],
        minLenght:[3,"Invalid name, Please enter the name with more than 3 characters"]
    },
    email:{
        type:String,
        required:[true,"Please provide an email"],
        unique: true,
        validate:[validator.isEmail,"Please enter a valid email"]

    },
    password:{
        type:String,
        required:[true,"Please provide a password"],
        minLenght:[8,"Invalid password, Please enter a password with more than 8 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetpasswordExpires:String,

},{timestamps:true})

userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return ;
    }
    this.password = await bcryptjs.hash(this.password,10);
})

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

userSchema.methods.verifyPassword = async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword, this.password);
}

userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetpasswordExpires = Date.now() + 30*60*1000
    return resetToken;
}

export default mongoose.model('User',userSchema);