import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import handleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";



export const registerUser = handleAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const avatarFile = req.files?.avatar
    if (!avatarFile) {
        return next(new handleError('Please upload an avatar', 400))
    }
    console.log('this is body', req.body);
    // const myCloud = await cloudinary.uploader.upload(avatar,{
    //     folder:'avatars',
    //     width:150,
    //     crop:'scale'
    // })

    const myCloud = await cloudinary.uploader.upload(
        `data:${avatarFile.mimetype};base64,${avatarFile.data.toString('base64')}`,
        {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        }
    )


    console.log(myCloud)
     
    const user = await User.create({
        name: name,
        email: email,
        password: password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    });
    const token = user.getJWTToken();
    res.status(201).json({
        success: true,
        user,
        token
    })
})


export const loginUser = handleAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new handleError("Please enter email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (!user) {
        return next(new handleError("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.verifyPassword(password);
    if (!isPasswordMatched) {
        return next(new handleError("Invalid email or password", 401))
    }

    sendToken(user, 200, res);

})


export const logout = handleAsyncError(async (req, res, next) => {
    res.clearCookie('token', {
        httpOnly: true,
        path: '/'
    })
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})

export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new handleError("User not found", 404));
    }
    let resetToken;
    try {
        resetToken = user.getResetPasswordToken();
        console.log(resetToken);
        await user.save({ validateBeforeSave: false });
    }
    catch (err) {
        console.log(err);
        return next(new handleError("Something went wrong", 500));
    }
    console.log(resetToken);
    const resetPasswordURL = `http://localhost/api/v1/reset/${resetToken}`;
    const message = `follow the link to reset your password: \n\n ${resetPasswordURL} \n\n if you have not requested this email, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "password reset request",
            message
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetpasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new handleError("Something went wrong", 500));
    }
})

export const resetPassword = handleAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetpasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
        return next(new handleError("Reset password token is invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new handleError("Both password and confirm password should be same", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetpasswordExpires = undefined;
    await user.save();
    sendToken(user, 200, res);
})


export const getUserDetails = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    console.log(user);
    res.status(200).json({
        success: true,
        user
    })
})


export const updateUserPassword = handleAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    const checkPassword = await user.verifyPassword(oldPassword);
    if (!checkPassword) {
        return new handleError("Old password is incorrect", 400);
    }
    if (newPassword !== confirmPassword) {
        return new handleError("New password and confirm password should be same", 400);
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
})


export const updateUserProfile = handleAsyncError(async (req, res, next) => {
    const { name, email } = req.body;
    const avatarFile = req.files?.avatar
    const updateUserDetail = {};
    if(avatarFile){
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.uploader.destroy(imageId);
        const myCloud = await cloudinary.uploader.upload(
            `data:${avatarFile.mimetype};base64,${avatarFile.data.toString('base64')}`,
        {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        }
        )
        updateUserDetail.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
    }
    }
    
    if (name) {
        updateUserDetail.name = name;
    }
    if (email) {
        updateUserDetail.email = email;
    }
    // if (avatar) {
    //     updateUserDetail.avatar = avatar;
    // }

    const user = await User.findByIdAndUpdate(req.user.id, updateUserDetail, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        user
    })
})

export const getAllUser = handleAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})

export const getSingleUser = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new handleError("User not found", 404));
    }
    res.status(200).json({
        success: true,
        user
    })
})

export const updateUserRole = handleAsyncError(async (req, res, next) => {
    const { role } = req.body;
    const newUserData = {
        role
    }
    const userss = await User.findById(req.params.id);
    console.log(`User55555: ${userss}`);
    console.log(`5555555555555555555555555`);
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        returnDocument: "after",
        runValidators: true
    })

    if (!user) {
        return next(new handleError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user
    })
})


export const deleteUser = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new handleError("User not found", 404));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        user
    })
})