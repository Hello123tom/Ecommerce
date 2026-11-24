import Order from '../models/orderModel.js';
import handleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';
import Product from '../models/productModel.js';


export const getSingleOrder = handleAsyncError(async(req,res,next) =>{
    const order = await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return next(new handleError("Order not found",404))
    }
    res.status(200).json({
        success:true,
        order
    })
})

export const allMyOrders = handleAsyncError(async(req,res,next) =>{
    const orders = await Order.find({user:req.user._id});
    if(!orders){
        return next(new handleError("No orders found",404))
    }
    res.status(200).json({
        success:true,
        orders
    })
})

export const getAllOrder = handleAsyncError(async(req,res,next) =>{
    const orders = await Order.find();
    if(!orders){
        return next(new handleError("No orders found",404))
    }
    let totalAmount = 0;
    orders.forEach(order =>{
        if (order.paymentStatus === "paid" || (!order.paymentStatus && order.paidAt)) {
            totalAmount += order.totalPrice
        }
    })
    res.status(200).json({
        success:true,
        totalAmount,
        orders,
        
    })
})


export const updateOrderStatus = handleAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new handleError("Order not found",404))
    }
    if(!["Processing", "Shipped", "Delivered"].includes(req.body.status)){
        return next(new handleError("Invalid order status",400))
    }
    const isLegacyPaidOrder = !order.paymentStatus && order.paidAt;
    if(order.paymentStatus !== "paid" && !isLegacyPaidOrder){
        return next(new handleError("Order cannot be fulfilled before payment",400))
    }
    if(order.orderStatus === "Delivered"){
     return next(new handleError("this order is already been delivered",404))
    }

    if(req.body.status === "Delivered"){
        await Promise.all(order.orderItems.map(item =>
            updateQuantity(item.product,item.quantity)
        ))
    }
    order.orderStatus = req.body.status;
    if(order.orderStatus === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        order
    })
})


async function updateQuantity(id,quantity){
    const product = await Product.findById(id);
    if (!product) {
        throw new handleError("Product not found", 404);
    }
    product.stock -= quantity;
    await product.save({validateBeforeSave:false});
}

export const deleteOrder = handleAsyncError(async(req,res,next) =>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new handleError("Order not found",404))
    }
    if(order.paymentStatus === "pending"){
        return next(new handleError("Pending payment orders cannot be deleted",400))
    }
    if(order.orderStatus === "Delivered"){
        return next(new handleError("this order is already been delivered",404))
       }
    await order.deleteOne({_id:req.params.id});
    res.status(200).json({
        success:true,
        message:"Order deleted successfully"
    })
})