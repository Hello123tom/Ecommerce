import express from 'express';
import {
    getSingleOrder, allMyOrders,
    getAllOrder,updateOrderStatus, deleteOrder
}from '../controller/orderController.js';
import { verifyUser,roleBaseAcess } from '../middleware/userAuth.js';
const router = express.Router()

router.route("/order/:id").get(verifyUser,getSingleOrder)
router.route("/admin/order/:id")
.put(verifyUser,roleBaseAcess("admin"),updateOrderStatus)
.delete(verifyUser,roleBaseAcess("admin"),deleteOrder);
router.route("/orders/user").get(verifyUser,allMyOrders);
router.route("/admin/orders").get(verifyUser,roleBaseAcess("admin"),getAllOrder);

export default router;