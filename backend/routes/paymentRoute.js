import express from "express";
import { verifyUser } from "../middleware/userAuth.js";
import {
    Payment,
    getPaymentStatus
} from "../controller/paymentController.js";


const router = express.Router();
router.route("/payment").post(verifyUser,Payment);
router.route("/payment/session/:sessionId").get(verifyUser, getPaymentStatus);
export default router;