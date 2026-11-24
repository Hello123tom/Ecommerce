import express from "express";
import multer from 'multer'

import { 
 registerUser, loginUser, logout, requestPasswordReset,
 resetPassword, getUserDetails, updateUserPassword, 
 updateUserProfile, getAllUser, getSingleUser,
 updateUserRole, deleteUser
} from "../controller/userController.js";

import { verifyUser, roleBaseAcess } from "../middleware/userAuth.js";


const router = express.Router();
// const upload = multer({
//   dest: 'backend/uploads/avatars/',
//   limits: { fileSize: 5 * 1024 * 1024 }
// })

router.route("/register").post(registerUser);
// router.route("/register").post(upload.single('avatar'),registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/password/forgot").post(requestPasswordReset);
router.route("/reset/:token").post(resetPassword);
router.route("/me").get(verifyUser,getUserDetails);
router.route("/password/update").put(verifyUser,updateUserPassword);
router.route("/me/profile").put(verifyUser,updateUserProfile);
router.route("/admin/users").get(verifyUser,roleBaseAcess("admin"),getAllUser);
router.route("/admin/user/:id").get(verifyUser,roleBaseAcess("admin"),getSingleUser)
.put(verifyUser,roleBaseAcess("admin"),updateUserRole).delete(verifyUser,roleBaseAcess("admin"),deleteUser);


export default router;